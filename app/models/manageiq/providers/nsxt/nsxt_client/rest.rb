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
    RestClient::Request.execute(:method => :get, :url => @login_url, :user => @user, :password => @password,
    :headers => @headers, :verify_ssl => @verify_ssl) do |response|
      case response.code
      when 200
        data = JSON.parse(response.body)
        return true
      else
        raise MiqException::MiqInvalidCredentialsError, "Login failed due to a bad username or password."
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
    response = RestClient::Request.execute(
      :url        => url,
      :method     => method,
      :data       => data,
      :user       => @user,
      :password   => @password,
      :verify_ssl => verify_ssl
    ) { |response| response } # silence errors like 404
    $nsxt_log.debug("NSX-T request with url #{url} has response #{response}")
    return response
  end
end