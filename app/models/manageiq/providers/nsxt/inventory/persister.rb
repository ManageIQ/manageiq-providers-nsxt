class ManageIQ::Providers::Nsxt::Inventory::Persister < ManageIQ::Providers::Inventory::Persister
  require_nested :NetworkManager
  require_nested :TargetCollection
end
