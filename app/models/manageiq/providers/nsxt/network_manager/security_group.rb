module ManageIQ::Providers::Nsxt
  class NetworkManager::SecurityGroup < ::SecurityGroup
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
