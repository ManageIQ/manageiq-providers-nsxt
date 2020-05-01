module ManageIQ::Providers::Nsxt
  class NetworkManager::SecurityPolicy < ::SecurityPolicy
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
