class ManageIQ::Providers::Nsxt::NetworkManager::NetworkRouter < ::NetworkRouter
  def self.display_name(number = 1)
    n_('Network Router (NSX-T)', 'Networks Router (NSX-T)', number)
  end
end