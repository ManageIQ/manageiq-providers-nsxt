require 'rest-client'
require 'rubygems'
require 'json'
class ManageIQ::Providers::Nsxt::NsxtClient
  include Vmdb::Logging
  def initialize(server, user, password)
    @server = server
    @user = user
    @password = password
    @client = Rest.new(server, user, password)
    connected, data = @client.login
    if connected
      return
    end
    $nsxt_log.error('NSX-T Authentication failed')
  end

  def get_tier_1(id)
    get("infra/tier-1s/#{id}")
  end

  def get_tier_1s
    list('infra/tier-1s')
  end

  def get_segment(id)
    get("infra/segments/#{id}")
  end

  def get_segments
    list('infra/segments')
  end

  def get_security_policy(id)
    get("infra/domains/default/security-policies/#{id}")
  end

  def get_security_policies
    list('infra/domains/default/security-policies')
  end

  def get_security_policy_rules(id)
    list("infra/domains/default/security-policies/#{id}/rules")
  end

  def get_service
    get("infra/services/#{id}")
  end

  def get_services
    list('infra/services')
  end

  def get_group(id)
    get("infra/domains/default/groups/#{id}")
  end

  def get_groups
    list('infra/domains/default/groups')
  end

  def get_group_members(id)
    list("infra/domains/default/groups/#{id}/members/virtual-machines")
  end

  private

  def list(url)
    json = get(url)
    return json['results'] || []
  end

  def get(url)
    response = @client.get("#{@server}/policy/api/v1/#{url}")
    return nil if response.body.empty? || response.code != 200
    json = JSON.parse(response.body)
    return json
  end
end