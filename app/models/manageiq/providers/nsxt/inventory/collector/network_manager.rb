class ManageIQ::Providers::Nsxt::Inventory::Collector::NetworkManager < ManageIQ::Providers::Nsxt::Inventory::Collector
  def services
    connection.get_services
  end

  def tier_1s
    connection.get_tier_1s
  end

  def segments
    connection.get_segments
  end

  def groups
    connection.get_groups
  end

  def security_policies
    connection.get_security_policies
  end

  def security_policy_rules(id)
    connection.get_security_policy_rules(id)
  end
end