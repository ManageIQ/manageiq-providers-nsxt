class ManageIQ::Providers::Nsxt::NetworkManager < ManageIQ::Providers::NetworkManager
  require_nested :CloudNetwork
  require_nested :CloudSubnet
  require_nested :NetworkPort
  require_nested :NetworkRouter
  require_nested :NetworkService
  require_nested :NetworkServiceEntry
  require_nested :RefreshWorker
  require_nested :Refresher
  require_nested :SecurityGroup
  require_nested :SecurityPolicy
  require_nested :SecurityPolicyRule

  supports :ems_network_new
  supports :cloud_tenant_mapping

  include SupportsFeatureMixin
  include ManageIQ::Providers::Nsxt::ManagerMixin

  def self.ems_type
    @ems_type ||= "nsxt".freeze
  end

  def self.description
    @description ||= "VMware NSX-T Network Manager".freeze
  end

  def self.supported_for_create?
    true
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

  def sync_cloud_tenants_with_tenants
    return unless supports_cloud_tenant_mapping? || !tenant_mapping_enabled

    $nsxt_log.info("Syncing CloudTenants with Tenants for provider #{name}")
    cloud_tenants.each do |cloud_tenant|
      next unless cloud_tenant.source_tenant.nil?

      tenant_parent = Tenant.find_by(:name => cloud_tenant.name)
      next if tenant_parent.nil?

      tenant_name = "Cloud Tenant #{cloud_tenant.name} for Network Provider #{name}"
      source_tenant = tenant_parent.all_subtenants.find_by(:name => tenant_name) || Tenant.new({:name => tenant_name, :description => tenant_name, :source => cloud_tenant, :parent => tenant_parent})
      source_tenant.save!
      cloud_tenant.source_tenant = source_tenant
      cloud_tenant.save!
      $nsxt_log.info("New Tenant #{tenant_name} created")
    end
  end

  def destroy_mapped_tenants
    if source_tenant
      source_tenant.all_subtenants.destroy_all
      source_tenant.all_subprojects.destroy_all
      source_tenant.destroy
    end
  end
end
