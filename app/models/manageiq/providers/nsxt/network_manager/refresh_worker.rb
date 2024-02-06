class ManageIQ::Providers::Nsxt::NetworkManager::RefreshWorker < ManageIQ::Providers::BaseManager::RefreshWorker
  def self.ems_class
    ManageIQ::Providers::Nsxt::NetworkManager
  end

  def self.settings_name
    :ems_refresh_worker_nsxt_network
  end
end
