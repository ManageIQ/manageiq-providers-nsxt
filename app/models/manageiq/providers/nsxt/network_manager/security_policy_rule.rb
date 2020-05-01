module ManageIQ::Providers::Nsxt
  class NetworkManager::SecurityPolicyRule < ::SecurityPolicyRule
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
