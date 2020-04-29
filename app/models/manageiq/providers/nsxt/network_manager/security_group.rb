module ManageIQ::Providers::Nsxt
  class NetworkManager::SecurityGroup < ::SecurityGroup
    include ManageIQ::Providers::Nsxt::CrudMixin

    supports :create
    supports :delete
    supports :update

    def security_groups_add_resource(parent, _type, _id, data)
      security_group = data["name"]
      begin
        raise "Cannot add #{security_group} to #{parent.name}" unless parent.supports_add_security_group?
        message = "Adding security group #{security_group} to #{parent.name}"
        task_id = queue_object_action(parent, message, :method_name => "add_security_group", :args => [security_group])
        action_result(true, message, :task_id => task_id)
      rescue => e
        action_result(false, e.to_s)
      end
    end
    
    def security_groups_remove_resource(parent, _type, _id, data)
      security_group = data["name"]
      begin
        raise "Cannot remove #{security_group} from #{parent.name}" unless parent.supports_remove_security_group?
        message = "Removing security group #{security_group} from #{parent.name}"
        task_id = queue_object_action(parent, message, :method_name => "remove_security_group", :args => [security_group])
        action_result(true, message, :task_id => task_id)
      rescue => e
        action_result(false, e.to_s)
      end
    end

    def self.raw_create_security_group(ext_management_system, options)
      current_user = User.current_user
      options[:action] = 'create'
      vars = {
        :group_name => options[:name],
        :group_description => options[:description] || '',
        :group_expression => map_vms_to_expression(options[:vms], options),
        :tenant_short_code => self.get_tenant_short_code(current_user)
      }
      result = self.nsxt_execute_action(ext_management_system, vars, options)
      return result
    end

    def raw_update_security_group(options = {})
      current_user = User.current_user
      options[:action] = 'update'
      vars = {
        :group_id => ems_ref,
        :group_name => options[:name],
        :group_description => options[:description] || '',
        :group_expression => self.class.map_vms_to_expression(options[:vms], options),
        :tenant_short_code => self.class.get_tenant_short_code(current_user)
      }
      result = self.class.nsxt_execute_action(ext_management_system, vars, options)
      return result
    end

    def raw_delete_security_group(options)
      options[:action] = 'delete'
      vars = {
        :group_id => ems_ref,
        :group_name => name
      }
      result = self.class.nsxt_execute_action(ext_management_system, vars, options)
      return result
    end

    def self.display_name(number = 1)
      n_('Security Group (NSX-T)', 'Security Groups (NSX-T)', number)
    end
  
    def self.nsxt_type
      'group'
    end

    def self.refresh_type
      :security_groups
    end

    def self.map_vms_to_expression(ids, options)
      return [] if ids.nil? || ids.size == 0
      external_ids = []
      ids.each do |id| 
        vm = Vm.find(id)
        raise "Vm with #{id} does not exists (anymore)" if vm.nil?
        external_ids << vm.instance_uuid
      end
      return [
        {
          :member_type => 'VirtualMachine',
          :external_ids => external_ids,
          :resource_type => 'ExternalIDExpression'
        }
      ]
    rescue StandardError => error
      self.create_notification(options, error)
      raise error
    end
  end
end