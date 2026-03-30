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
end
