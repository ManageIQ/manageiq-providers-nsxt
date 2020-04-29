class ManageIQ::Providers::Nsxt::NetworkManager::NetworkPort < ::NetworkPort
  def self.display_name(number = 1)
    n_('Network Port (NSX-T)', 'Networks Ports (NSX-T)', number)
  end
end