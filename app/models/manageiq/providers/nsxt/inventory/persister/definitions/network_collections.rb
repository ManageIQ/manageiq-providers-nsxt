module ManageIQ::Providers::Nsxt::Inventory::Persister::Definitions::NetworkCollections
  extend ActiveSupport::Concern
  def initialize_network_inventory_collections
    $nsxt_log.info('Collecting NSX-T inventory')
    %i[
      network_routers
      cloud_tenants
      cloud_networks
      cloud_subnets
      security_groups
      security_policies
      security_policy_rules
      network_ports
      network_services
      network_service_entries
    ].each do |name|
      add_network_collection(name)
    end
  end
end
