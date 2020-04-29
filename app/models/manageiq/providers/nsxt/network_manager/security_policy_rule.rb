module ManageIQ::Providers::Nsxt
  class NetworkManager::SecurityPolicyRule < ::SecurityPolicyRule
    include ManageIQ::Providers::Nsxt::CrudMixin

    supports :create
    supports :delete
    supports :update

    def self.raw_create_security_policy_rule(ext_management_system, options)
      current_user = User.current_user
      security_policy = SecurityPolicy.find(options[:security_policy_id])
      options[:action] = 'create'
      options[:refresh_ems_ref] = security_policy.ems_ref
      source_groups = map_groups_to_list(options[:source_groups], options)
      destination_groups = map_groups_to_list(options[:destination_groups], options)
      services = map_services_to_list(options[:services], options)
      vars = {
        :security_policy_id => security_policy.ems_ref,
        :security_policy_rule_name => options[:name],
        :security_policy_rule_description => options[:description] || '',
        :security_policy_rule_source_groups => source_groups,
        :security_policy_rule_destination_groups => destination_groups,
        :security_policy_rule_services => services,
        :tenant_short_code => self.get_tenant_short_code(current_user)
      }
      result = self.nsxt_execute_action(ext_management_system, vars, options)
      return result
    end

    def raw_update_security_policy_rule(options = {})
      options[:action] = 'update'
      options[:refresh_ems_ref] = security_policy.ems_ref
      source_groups = self.class.map_groups_to_list(options[:source_groups], options)
      destination_groups = self.class.map_groups_to_list(options[:destination_groups], options)
      services = self.class.map_services_to_list(options[:services], options)
      vars = {
        :security_policy_id => security_policy.ems_ref,
        :security_policy_rule_id => ems_ref,
        :security_policy_rule_name => options[:name],
        :security_policy_rule_description => options[:description] || '',
        :security_policy_rule_source_groups => source_groups,
        :security_policy_rule_destination_groups => destination_groups,
        :security_policy_rule_services => services,
      }
      result = self.class.nsxt_execute_action(ext_management_system, vars, options)
      return result
    end

    def raw_delete_security_policy_rule(options)
      options[:action] = 'delete'
      options[:refresh_ems_ref] = security_policy.ems_ref
      vars = {
        :security_policy_id => security_policy.ems_ref,
        :security_policy_rule_id => ems_ref,
        :security_policy_rule_name => name
      }
      result = self.class.nsxt_execute_action(ext_management_system, vars, options)
      return result
    end

    def self.display_name(number = 1)
      n_('Security Policy Rule (NSX-T)', 'Security Policy Rules (NSX-T)', number)
    end
  
    def self.nsxt_type
      'security_policy_rule'
    end

    def self.refresh_type
      :security_policies
    end

    private

    def self.map_groups_to_list(ids, options)
      raise "The list must contain at least 1 group" [] if ids.nil? || 1 < ids.size == 0
      external_ids = []
      ids.each do |id| 
        group = SecurityGroup.find(id)
        raise "Security Group with #{id} does not exists (anymore)" if group.nil?
        external_ids << group.ems_ref
      end
      return external_ids
    rescue StandardError => error
      self.create_notification(options, error)
      raise error
    end

    def self.map_services_to_list(ids, options)
      raise "The list must contain at least 1 service" [] if ids.nil? || ids.size == 0
      external_ids = []
      ids.each do |id| 
        service = NetworkService.find(id)
        raise "Network Service with #{id} does not exists (anymore)" if service.nil?
        external_ids << service.ems_ref
      end
      return external_ids
    rescue StandardError => error
      self.create_notification(options, error)
      raise error
    end
  end
end