class ManageIQ::Providers::Nsxt::Inventory::Persister::TargetCollection < ManageIQ::Providers::Nsxt::Inventory::Persister
  include ManageIQ::Providers::Nsxt::Inventory::Persister::Definitions::NetworkCollections

  def targeted?
    true
  end

  def strategy
    :local_db_find_missing_references
  end

  def initialize_inventory_collections
    initialize_network_inventory_collections
  end
end
