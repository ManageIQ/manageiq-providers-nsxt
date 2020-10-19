class ManageIQ::Providers::Nsxt::NsxtClient::Rest
  include Vmdb::Logging
  def initialize(server, user, password, verify_ssl)
    @server = server
    @user = user
    @password = password
    @verify_ssl = verify_ssl
  end

  def login
    @login_url = @server + "/api/v1/license"
    RestClient::Request.execute(:method => :get, :url => @login_url, :user => @user, :password => @password, :verify_ssl => @verify_ssl) do |response|
      case response.code
      when 200
        data = JSON.parse(response.body)
        return true
      when 403
        raise MiqException::MiqInvalidCredentialsError, "Login failed due to a bad username or password."
      else
        raise MiqException::MiqInvalidCredentialsError, "Login failed due to unknown error. #{response}"
      end
    end
  end

  class << self
    attr_reader :server
  end

  def get(url)
    request(url)
  end

  def delete(url)
    request(url, :method => :delete)
  end

  def put(url, data)
    request(url, :method => :put, :data => data)
  end

  def post(url, data)
    request(url, :method => :post, :data => data)
  end

  def request(url, method: :get, data: nil, verify_ssl: @verify_ssl)
    $nsxt_log.debug("NSX-T request with url #{url}")

    options = {
      :url        => url,
      :method     => method,
      :user       => @user,
      :password   => @password,
      :verify_ssl => verify_ssl
    }
    proxy = VMDB::Util.http_proxy_uri(:nsxt) || VMDB::Util.http_proxy_uri(:default)
    options[:proxy] = proxy if proxy
    options[:payload] = data if data

    response = RestClient::Request.execute(options) { |response| response } # silence errors like 404
    $nsxt_log.debug("NSX-T request with url #{url} has response #{response}")
    return response
  end
end
