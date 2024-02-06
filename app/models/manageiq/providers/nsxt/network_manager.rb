class ManageIQ::Providers::Nsxt::NetworkManager < ManageIQ::Providers::NetworkManager
  supports :cloud_tenant_mapping
  supports :create
  supports :update

  include SupportsFeatureMixin
  include ManageIQ::Providers::Nsxt::ManagerMixin

  def self.ems_type
    @ems_type ||= "nsxt".freeze
  end

  def self.description
    @description ||= "VMware NSX-T Network Manager".freeze
  end

  def name
    self[:name]
  end

  def queue_name_for_ems_refresh
    queue_name
  end

  def cloud_tenants
    ::CloudTenant.where(:ems_id => id)
  end

  def create_cloud_network(cloud_network)
    ManageIQ::Providers::Nsxt::NetworkManager::CloudNetwork.raw_create_cloud_network(self, cloud_network)
  end

  def create_security_group(security_group)
    ManageIQ::Providers::Nsxt::NetworkManager::SecurityGroup.raw_create_security_group(self, security_group)
  end

  def create_security_policy(security_policy)
    ManageIQ::Providers::Nsxt::NetworkManager::SecurityPolicy.raw_create_security_policy(self, security_policy)
  end

  def create_security_policy_rule(security_policy_rule)
    ManageIQ::Providers::Nsxt::NetworkManager::SecurityPolicyRule.raw_create_security_policy_rule(self, security_policy_rule)
  end
end
