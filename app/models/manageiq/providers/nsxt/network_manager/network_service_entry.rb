class ManageIQ::Providers::Nsxt::NetworkManager::NetworkServiceEntry < ::NetworkServiceEntry
  def self.display_name(number = 1)
    n_('Network Service Entry (NSX-T)', 'Networks Service Entry (NSX-T)', number)
  end
end