module ManageIQ::Providers::Nsxt
  class NetworkManager::SecurityPolicy < ::SecurityPolicy
    include ManageIQ::Providers::Nsxt::CrudMixin

    supports :create
    supports :delete
    supports :update

    def self.raw_create_security_policy(ext_management_system, options)
      current_user = User.current_user
      options[:action] = 'create'
      vars = {
        :security_policy_name => options[:name],
        :security_policy_description => options[:description] || '',
        :tenant_short_code => self.get_tenant_short_code(current_user)
      }
      result = self.nsxt_execute_action(ext_management_system, vars, options)
      return result
    end

    def raw_update_security_policy(options = {})
      options[:action] = 'update'
      vars = {
        :security_policy_id => ems_ref,       
        :security_policy_name => options[:name],
        :security_policy_description => options[:description] || '',
      }
      result = self.class.nsxt_execute_action(ext_management_system, vars, options)
      return result
    end

    def raw_delete_security_policy(options)
      options[:action] = 'delete'
      vars = {
        :security_policy_id => ems_ref,
        :security_policy_name => name
      }
      result = self.class.nsxt_execute_action(ext_management_system, vars, options)
      return result
    end

    def self.display_name(number = 1)
      n_('Security Policy (NSX-T)', 'Security Policies (NSX-T)', number)
    end

    def self.nsxt_type
      'security_policy'
    end

    def self.refresh_type
      :security_policies
    end
  end
end