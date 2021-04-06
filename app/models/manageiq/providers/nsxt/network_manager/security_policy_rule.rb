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
  end
end
