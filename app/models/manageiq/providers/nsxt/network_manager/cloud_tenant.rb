class ManageIQ::Providers::Nsxt::NetworkManager::CloudTenant < ::CloudTenant
  def self.display_name(number = 1)
    n_('Cloud Tenant (NSX-T)', 'Cloud Tenants (NSX-T)', number)
  end
end