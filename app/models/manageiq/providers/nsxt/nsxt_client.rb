require 'rubygems'
require 'json'

class ManageIQ::Providers::Nsxt::NsxtClient
  include Vmdb::Logging

  def initialize(server, path, user, password, verify_ssl = false)
    require 'rest-client'

    @base_url = "#{server}/#{path}"
    @user     = user
    @password = password
    @client   = Rest.new(server, user, password, verify_ssl)

    connected = @client.login
    return if connected

    raise 'NSX-T Authentication failed'
  end

  def get_tier_1(id)
    get("tier-1s/#{id}")
  end

  def get_tier_1s
    list('tier-1s')
  end

  def get_segment(id)
    get("segments/#{id}")
  end

  def get_segments
    list('segments')
  end

  def get_security_policy(id)
    get("domains/default/security-policies/#{id}")
  end

  def get_security_policies
    list('domains/default/security-policies')
  end

  def get_security_policy_rules(id)
    list("domains/default/security-policies/#{id}/rules")
  end

  def get_service
    get("services/#{id}")
  end

  def get_services
    list('services')
  end

  def get_group(id)
    get("domains/default/groups/#{id}")
  end

  def get_groups
    list('domains/default/groups')
  end

  private

  def list(url)
    json = get(url)
    json&.dig("results") || []
  end

  def get(url)
    response = @client.get("#{@base_url}/#{url}")
    if response.body.empty? || response.code != 200
      $nsxt_log.warn("Invalid response #{response} for REST call #{@base_url}/#{url}")
      return nil
    end
    json = JSON.parse(response.body)
    return json
  end
end
