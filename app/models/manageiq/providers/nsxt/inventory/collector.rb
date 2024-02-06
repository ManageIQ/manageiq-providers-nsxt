class ManageIQ::Providers::Nsxt::Inventory::Collector < ManageIQ::Providers::Inventory::Collector
  def connection 
    @connection ||= manager.connect
  end
end
