module ManageIQ::Providers::Nsxt::ManagerMixin
  extend ActiveSupport::Concern

  module ClassMethods
    def raw_connect(server, path, username, password, verify_ssl = false)
      ManageIQ::Providers::Nsxt::NsxtClient.new(server, path, username, password, verify_ssl)
    end

    def translate_exception(err)
      case err
      when Excon::Errors::Unauthorized
        MiqException::MiqInvalidCredentialsError.new "Login failed due to a bad username or password."
      when Excon::Errors::Timeout
        MiqException::MiqUnreachableError.new "Login attempt timed out"
      when Excon::Errors::SocketError
        MiqException::MiqHostError.new "Socket error: #{err.message}"
      when MiqException::MiqInvalidCredentialsError, MiqException::MiqHostError
        err
      else
        MiqException::MiqEVMLoginError.new "Unexpected response returned from system: #{err.message}"
      end
    end

    def params_for_create
      {
        :fields => [
          {
            :component => 'switch',
            :id        => 'tenant_mapping_enabled',
            :name      => 'tenant_mapping_enabled',
            :label     => _('Tenant Mapping Enabled'),
          },
          {
            :component => 'sub-form',
            :id        => 'endpoints-subform',
            :name      => 'endpoints-subform',
            :title     => _("Endpoints"),
            :fields    => [
              {
                :component              => 'validate-provider-credentials',
                :id                     => 'endpoints.default.valid',
                :name                   => 'endpoints.default.valid',
                :skipSubmit             => true,
                :isRequired             => true,
                :validationDependencies => %w[type zone_id],
                :fields                 => [
                  {
                    :component    => "select",
                    :id           => "endpoints.default.security_protocol",
                    :name         => "endpoints.default.security_protocol",
                    :label        => _("Security Protocol"),
                    :isRequired   => true,
                    :initialValue => 'ssl-with-validation',
                    :validate     => [{:type => "required"}],
                    :options      => [
                      {
                        :label => _("SSL without validation"),
                        :value => "ssl-no-validation"
                      },
                      {
                        :label => _("SSL"),
                        :value => "ssl-with-validation"
                      },
                      {
                        :label => _("Non-SSL"),
                        :value => "non-ssl"
                      }
                    ]
                  },
                  {
                    :component  => "text-field",
                    :id         => "endpoints.default.hostname",
                    :name       => "endpoints.default.hostname",
                    :label      => _("Hostname (or IPv4 or IPv6 address)"),
                    :isRequired => true,
                    :validate   => [{:type => "required"}]
                  },
                  {
                    :component    => "text-field",
                    :id           => "endpoints.default.port",
                    :name         => "endpoints.default.port",
                    :label        => _("API Port"),
                    :type         => "number",
                    :isRequired   => true,
                    :validate     => [{:type => "required"}],
                    :initialValue => 443,
                  },
                  {
                    :component  => "select",
                    :id         => "endpoints.default.path",
                    :name       => "endpoints.default.path",
                    :label      => _("Manager Role"),
                    :isRequired => true,
                    :validate   => [{:type => "required"}],
                    :options    => [
                      {
                        :label => _("Federation Global Manager"),
                        :value => "global-manager/api/v1/global-infra"
                      },
                      {
                        :label => _("Federation Local or Single Manager"),
                        :value => "policy/api/v1/infra"
                      }
                    ]
                  },
                  {
                    :component  => "text-field",
                    :id         => "authentications.default.userid",
                    :name       => "authentications.default.userid",
                    :label      => _("Username"),
                    :isRequired => true,
                    :validate   => [{:type => "required"}],
                  },
                  {
                    :component  => "password-field",
                    :id         => "authentications.default.password",
                    :name       => "authentications.default.password",
                    :label      => _("Password"),
                    :type       => "password",
                    :isRequired => true,
                    :validate   => [{:type => "required"}],
                  },
                ],
              },
            ],
          },
        ]
      }.freeze
    end

    def verify_credentials(args)
      endpoint = args.dig("endpoints", 'default')
      hostname, security_protocol, port, path = endpoint&.values_at('hostname', 'security_protocol', 'port', 'path')
      authentication = args.dig("authentications", "default")
      userid, password = authentication&.values_at('userid', 'password')
      password = ManageIQ::Password.try_decrypt(password)
      !!raw_connect(base_url(security_protocol, hostname, port), path, userid, password, security_protocol == 'ssl-with-validation')
    end

    def base_url(protocol, server, port)
      scheme = protocol == 'non-ssl' ? "http" : "https"
      URI::Generic.build(:scheme => scheme, :host => server, :port => port).to_s
    end
  end

  def description
    "VMware NSX-T"
  end

  def connect(options = {})
    raise "no credentials defined" if self.missing_credentials?(options[:auth_type])

    protocol    = options[:protocol] || security_protocol
    server      = options[:ip] || address
    port        = options[:port] || self.port
    path        = options[:path] || endpoint_path
    verify_ssl  = options[:verify_ssl] || verify_ssl
    username    = options[:user] || authentication_userid(options[:auth_type])
    password    = options[:pass] || authentication_password(options[:auth_type])

    server = self.class.base_url(protocol, server, port)
    self.class.raw_connect(server, path, username, password, verify_ssl)
  end

  def verify_credentials(auth_type = nil, options = {})
    auth_type ||= 'default'

    raise MiqException::MiqHostError, "No credentials defined" if missing_credentials?(auth_type)

    options[:auth_type] = auth_type
    with_provider_connection(options) {}
    true
  rescue => err
    miq_exception = self.class.translate_exception(err)
    raise unless miq_exception

    $nsxt_log.error("Error Class=#{err.class.name}, Message=#{err.message}")
    raise miq_exception
  end
end
