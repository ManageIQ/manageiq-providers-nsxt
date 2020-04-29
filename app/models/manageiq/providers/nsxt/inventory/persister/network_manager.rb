class ManageIQ::Providers::Nsxt::Inventory::Persister::NetworkManager < ManageIQ::Providers::Nsxt::Inventory::Persister
  include ManageIQ::Providers::Nsxt::Inventory::Persister::Definitions::NetworkCollections

  def initialize_inventory_collections
    initialize_network_inventory_collections
  end
end
