module ManageIQ::Providers::Nsxt::Inventory::Persister::Definitions::NetworkCollections
  extend ActiveSupport::Concern
  def initialize_network_inventory_collections
    $nsxt_log.info('Collecting NSX-T inventory')
    %i(network_routers
       cloud_tenants
       cloud_networks
       cloud_subnets
       security_groups
       security_policies
       security_policy_rules
       network_ports
       network_services
       network_service_entries).each do |name|
    
      add_collection(network, name) do |builder|
        builder.add_properties(:parent => manager) # including targeted
      end
    end

    add_cross_provider_vms
  end

  def add_cross_provider_vms
    add_collection(cloud, :vms) do |builder|
      builder.add_properties(
        :arel           => Vm.all,
        :strategy       => :local_db_find_references,
        :association    => nil,
        :secondary_refs => { :by_uid_ems => %i(uid_ems) }
      )
    end
  end
end