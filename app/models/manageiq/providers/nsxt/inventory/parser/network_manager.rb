class ManageIQ::Providers::Nsxt::Inventory::Parser::NetworkManager < ManageIQ::Providers::Nsxt::Inventory::Parser
  def parse
    network_services
    network_routers
    cloud_networks
    security_groups
    security_policies
  end

  def network_services
    collector.services.each do |service|
      network_service = persister.network_services.find_or_build(service['id'])
      network_service.name = service['display_name']
      network_service.description = service['description']
      network_service.shared = service['is_default']
      network_service_entries(service, network_service)
    end
  end

  def network_service_entries(service, network_service)
    service['service_entries'].each do |service_entry|
      service_entry_id = service_entry['unique_id'] || service_entry['id']
      network_service_entry = persister.network_service_entries.find_or_build("#{service['id']}-#{service_entry_id}")
      network_service_entry.name = service_entry['display_name']
      network_service_entry.network_service = network_service
      if service_entry['resource_type'] == 'L4PortSetServiceEntry'
        network_service_entry.protocol = service_entry['l4_protocol']
        network_service_entry.source_ports = network_service_entry_ports(service_entry['source_ports'])
        network_service_entry.destination_ports = network_service_entry_ports(service_entry['destination_ports'])
      elsif service_entry['resource_type'] == 'ALGTypeServiceEntry'
        network_service_entry.protocol = service_entry['alg']
        network_service_entry.source_ports = network_service_entry_ports(service_entry['source_ports'])
        network_service_entry.destination_ports = network_service_entry_ports(service_entry['destination_ports'])
      elsif service_entry['resource_type'] == 'ICMPTypeServiceEntry'
        network_service_entry.protocol = service_entry['protocol']
      end
    end
  end

  def network_service_entry_ports(ports)
    return if ports.empty? ? 'ANY' : ports.join(',')
  end

  def network_routers
    collector.tier_1s.each do |tier_1|
      network_router = persister.network_routers.find_or_build(tier_1['id'])
      network_router.name = tier_1['display_name']
      network_router.cloud_tenant = cloud_tenant(tier_1['tags'])
      network_router.status = 'active'
    end
  end

  def cloud_networks
    collector.segments.each do |segment|
      next if segment['type'] == 'DISCONNECTED'
      cloud_network = persister.cloud_networks.find_or_build(segment['id'])
      cloud_network.name = segment['display_name']
      cloud_network.description = segment['description']
      cloud_network.cloud_tenant = cloud_tenant(segment['tags'])
      cloud_network.status = 'active'
      cloud_network.enabled = true
      network_router_id = segment['connectivity_path']&.split('/tier-1s/')&.last
      network_router = persister.network_routers.lazy_find(network_router_id) unless network_router_id.nil?
      cloud_subnets(segment, network_router)
    end
  end

  def cloud_subnets(segment, network_router)
    return if segment['subnets'].nil?
    segment['subnets'].each do |segment_subnet|
      id = "#{segment['id']}-#{segment_subnet['network']}"
      cloud_subnet = persister.cloud_subnets.find_or_build(id)
      cloud_subnet.name = "#{segment['display_name']}-#{segment_subnet['network']}"
      cloud_subnet.cloud_tenant = cloud_tenant(segment['tags'])
      cloud_subnet.cidr = segment_subnet['network']
      cloud_subnet.gateway = segment_subnet['gateway_address']&.split('/')&.first
      cloud_subnet.dhcp_enabled = false
      cloud_subnet.cloud_network = persister.cloud_networks.lazy_find(segment['id'])
      cloud_subnet.network_router = network_router

      network_ports(segment, cloud_subnet)
    end
  end

  def network_ports(segment, cloud_subnet)
  #   # TODO: this depends on vm.instance_uuid which doesn't exist yet
  #   Lan.where(:ems_ref => segment['id']).each do |lan|
  #     lan.vms.each do |vm|
  #       next if cloud_subnet&.cloud_tenant&.source_tenant.nil?
  #       next if vm.tenant_id != cloud_subnet.cloud_tenant.source_tenant.id
  #       network_port = persister.network_ports.find_or_build("#{segment['id']}_#{vm.instance_uuid}")
  #       network_port.name = vm.name
  #       network_port.device = vm
  #       network_port.device_ref = vm.instance_uuid
  #       network_port.cloud_tenant = cloud_subnet.cloud_tenant
  #       network_port.cloud_subnets = [] if network_port.cloud_subnets.nil?
  #       network_port.cloud_subnets << cloud_subnet
  #       network_port.status = 'active'
  #     end
  #   end
  end

  def security_groups
    collector.groups.each do |group|
      next if group['id'] == 'ANY'

      security_group = persister.security_groups.find_or_build(group['id'])
      security_group.name = group['display_name']
      security_group.description = group['description']
      security_group.cloud_tenant = cloud_tenant(group['tags'])
      security_group.network_ports = []
      security_groups_network_ports_vm(group, security_group)
      security_groups_network_ports_subnets(group, security_group)
    end
  end

  def security_groups_network_ports_vm(group, security_group)
    # TODO: This depends on vm.instance_uuid which doesn't exist yet
    # return if group['expression'].nil?

    # expressions = group['expression'].select do |expression|
    #   expression['resource_type'] == 'ExternalIDExpression' && expression['member_type'] == 'VirtualMachine'
    # end
    # expressions.each do |expression|
    #   expression['external_ids'].each do |external_id|
    #     vm = Vm.find_by(:instance_uuid => external_id)
    #     next if vm.nil?

    #     network_port = persister.network_ports.find_or_build("#{group['id']}#{external_id}")
    #     network_port.name = vm.name
    #     network_port.cloud_tenant = security_group.cloud_tenant
    #     network_port.status = 'active'
    #     network_port.device = vm
    #     network_port.device_ref = external_id
    #     network_port.security_groups = [] if network_port.security_groups.nil?
    #     network_port.security_groups << security_group
    #   end
    # end
  end

  def security_groups_network_ports_subnets(group, security_group)
    return if group['expression'].nil?

    expressions = group['expression'].select do |expression|
      expression['resource_type'] == 'IPAddressExpression'
    end
    expressions.each_with_index do |expression, index|
      network_port = persister.network_ports.find_or_build(expression['id'])
      network_port.name = "#{group['display_name']} #{index + 1}"
      network_port.cloud_tenant = security_group.cloud_tenant
      network_port.status = 'active'
      network_port.device = security_group
      network_port.device_ref = group['id']
      security_group.network_ports = [] if security_group.network_ports.nil?
      security_group.network_ports << network_port

      expression['ip_addresses'].each do |ip_address|
        cloud_subnet = persister.cloud_subnets.find_or_build("external_#{ip_address}")
        cloud_subnet.name = ip_address
        cloud_subnet.cidr = ip_address
        cloud_subnet.dhcp_enabled = false
        cloud_subnet.network_ports = [] if cloud_subnet.network_ports.nil?
        cloud_subnet.network_ports << network_port

        network_port.cloud_subnets = [] if network_port.cloud_subnets.nil?
        network_port.cloud_subnets << cloud_subnet
      end
    end
  end

  def security_policies
    collector.security_policies.each do |policy|
      security_policy = persister.security_policies.find_or_build(policy['id'])
      security_policy.name = policy['display_name']
      security_policy.description = policy['description']
      security_policy.cloud_tenant = cloud_tenant(policy['tags'])
      security_policy.sequence_number = policy['sequence_number']
      security_policy_rules(security_policy)
    end
  end

  def security_policy_rules(security_policy)
    collector.security_policy_rules(security_policy.ems_ref).each do |rule|
      security_policy_rule = persister.security_policy_rules.find_or_build(rule['id'])
      security_policy_rule.name = rule['display_name']
      security_policy_rule.description = rule['description']
      security_policy_rule.cloud_tenant = security_policy.cloud_tenant
      security_policy_rule.security_policy = security_policy
      security_policy_rule.sequence_number = rule['sequence_number']
      security_policy_rule.status = !rule['disabled'] ? 'active' : 'disabled'
      security_policy_rule.action = rule['action']
      security_policy_rule.direction = rule['direction']
      security_policy_rule.ip_protocol = rule['ip_protocol']
      security_policy_rule.sources_excluded = rule['sources_excluded'].present? ? rule['sources_excluded'] : false
      security_policy_rule.destinations_excluded = rule['destinations_excluded'].present? ? rule['destinations_excluded'] : false
      security_policy_rule.source_security_groups = rule['source_groups']
        .map{|group| persister.security_groups.lazy_find(group.split('/groups/').last)}
        .compact
      security_policy_rule.destination_security_groups = rule['destination_groups']
        .map{|group| persister.security_groups.lazy_find(group.split('/groups/').last)}
        .compact
      security_policy_rule.network_services = rule['services']
        .map{|service| persister.network_services.lazy_find(service.split('/services/').last)}
        .compact
    end
  end

  private

  def get_tag_value_by_scope(tags, scope)
    tag = tags&.find { |t| t['scope'].upcase == scope.upcase }
    return nil if tag.nil?
    return tag['tag']
  end

  def cloud_tenant(tags)
    cloud_tenant_tag = get_tag_value_by_scope(tags, 'tenant')
    return nil if cloud_tenant_tag.nil?
    cloud_tenant_id = cloud_tenant_tag.upcase
    cloud_tenant = persister.cloud_tenants.find_or_build(cloud_tenant_id)
    cloud_tenant.name = cloud_tenant_id
    return cloud_tenant
  end
end
