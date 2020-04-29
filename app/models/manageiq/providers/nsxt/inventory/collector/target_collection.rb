class ManageIQ::Providers::Nsxt::Inventory::Collector::TargetCollection < ManageIQ::Providers::Nsxt::Inventory::Collector
  def initialize(_manager, _target)
    super

    # Reset the target cache, so we can access new targets inside
    target.manager_refs_by_association_reset
  end

  def services
    return [] if (refs = references(:network_services)).blank?
    refs.map { |ems_ref| connection.get_service(ems_ref) }.compact
  end

  def tier_1s
    return [] if (refs = references(:network_routers)).blank?
    refs.map { |ems_ref| connection.get_tier_1(ems_ref) }.compact
  end

  def segments
    return [] if (refs = references(:cloud_networks)).blank?
    refs.map { |ems_ref| connection.get_segment(ems_ref) }.compact
  end

  def groups
    return [] if (refs = references(:security_groups)).blank?
    refs.map { |ems_ref| connection.get_group(ems_ref) }.compact
  end

  def group_members(ems_ref)
    connection.get_group_members(ems_ref)
  end
  
  def security_policies
    return [] if (refs = references(:security_policies)).blank?
    refs.map { |ems_ref| connection.get_security_policy(ems_ref) }.compact
  end

  def security_policy_rules(id)
    connection.get_security_policy_rules(id)
  end

  private

  def references(collection)
    target.manager_refs_by_association.try(:[], collection).try(:[], :ems_ref).try(:to_a) || []
  end
end