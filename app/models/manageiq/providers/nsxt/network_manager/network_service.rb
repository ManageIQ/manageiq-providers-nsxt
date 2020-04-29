class ManageIQ::Providers::Nsxt::NetworkManager::NetworkService < ::NetworkService
  def self.display_name(number = 1)
    n_('Network Service (NSX-T)', 'Networks Service (NSX-T)', number)
  end
end