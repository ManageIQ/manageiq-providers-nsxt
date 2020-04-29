class ManageIQ::Providers::Nsxt::Inventory::Collector < ManageIQ::Providers::Inventory::Collector
  require_nested :NetworkManager
  require_nested :TargetCollection

  def connection 
    @connection ||= manager.connect
  end
end
