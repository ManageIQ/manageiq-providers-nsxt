require 'rest-client'

module ManageIQ::Providers::Nsxt::ManagerMixin
  extend ActiveSupport::Concern

  module ClassMethods
    def raw_connect(base_url, username, password)
      ManageIQ::Providers::Nsxt::NsxtClient.new(base_url, username, password)
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
  end

  def description
    "Vmware NSX-T"
  end

  def base_url(protocol, server, port)
    scheme = %w(ssl ssl-with-validation).include?(protocol) ? "https" : "http"
    URI::Generic.build(:scheme => scheme, :host => server, :port => port).to_s
  end

  def connect(options = {})
    raise "no credentials defined" if self.missing_credentials?(options[:auth_type])

    protocol = options[:protocol] || security_protocol
    server   = options[:ip] || address
    port     = options[:port] || self.port
    username = options[:user] || authentication_userid(options[:auth_type])
    password = options[:pass] || authentication_password(options[:auth_type])

    url = base_url(protocol, server, port)
    self.class.raw_connect(url, username, password)
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