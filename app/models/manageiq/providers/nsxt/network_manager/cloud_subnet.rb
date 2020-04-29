class ManageIQ::Providers::Nsxt::NetworkManager::CloudSubnet < ::CloudSubnet
  def self.display_name(number = 1)
    n_('Cloud Subnet (NSX-T)', 'Cloud Subnets (NSX-T)', number)
  end
end
