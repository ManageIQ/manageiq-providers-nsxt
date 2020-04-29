module ManageIQ::Providers::Nsxt
  class NetworkManager::CloudNetwork < ::CloudNetwork
    include ManageIQ::Providers::Nsxt::CrudMixin

    supports :create
    supports :delete
    supports :update

    # Define all getters and setters for extra_attributes related virtual columns
    %i[security_zone].each do |action|
      define_method("#{action}=") do |value|
        extra_attributes_save(action, value)
      end

      define_method(action) do
        extra_attributes_load(action)
      end
    end

    def self.raw_create_cloud_network(ext_management_system, options)
      current_user = User.current_user
      options[:action] = 'create'
      options[:template_job_prefix] = 'osp_network'
      options[:template_job_response_prefix] = 'osp_ipv4_segment'
      vars = {
        :network_name        => options[:name],
        :network_description => options[:description] || '',
        :network_prefix      => options[:subnet_mask],
        :network_zone        => options[:security_zone],
        :tenant_short_code   => get_tenant_short_code(current_user),
        :requester           => current_user.email || current_user.name
      }
      result = nsxt_execute_action(ext_management_system, vars, options)
      result
    end

    def raw_update_cloud_network(options = {})
      current_user = User.current_user
      options[:action] = 'update'
      options[:template_job_prefix] = 'osp_network'
      options[:refresh_ems_ref] = ems_ref
      vars = {
        :segment_id          => ems_ref,
        :network_name        => options[:name],
        :network_description => options[:description] || '',
        :requester           => current_user.email || current_user.name
      }
      result = self.class.nsxt_execute_action(ext_management_system, vars, options)
      result
    end

    def raw_delete_cloud_network(options)
      options[:action] = 'delete'
      options[:template_job_prefix] = 'osp_network'
      options[:name] = name
      options[:refresh_ems_ref] = ems_ref
      vars = {
        :segment_id   => ems_ref,
        :network_name => name
      }
      result = self.class.nsxt_execute_action(ext_management_system, vars, options)
      result
    end

    def self.display_name(number = 1)
      n_('Cloud Network (NSX-T)', 'Cloud Networks (NSX-T)', number)
    end

    def self.nsxt_type
      :segment
    end

    def self.refresh_type
      :cloud_networks
    end
  end
end
