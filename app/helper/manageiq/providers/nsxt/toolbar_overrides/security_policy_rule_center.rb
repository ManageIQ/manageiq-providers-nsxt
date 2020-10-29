module ManageIQ
  module Providers
    module Nsxt
      module ToolbarOverrides
        class SecurityPolicyRuleCenter < ::ApplicationHelper::Toolbar::Override
          button_group(
            'security_policy_rule_vmdb',
            [
              select(
                :security_policy_rule_vmdb_choice,
                'fa fa-cog fa-lg',
                t = N_('Configuration'),
                t,
                :items => [
                  button(
                    :security_policy_rule_edit,
                    'pficon pficon-edit fa-lg',
                    t = N_('Edit Security Policy Rule (NSX-T)'),
                    t,
                    :data => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :controller     => 'provider_dialogs',
                        :button         => :nsxt_update_security_policy_rule,
                        :modal_title    => N_('Update Security Policy Rule (NSX-T)'),
                        :component_name => 'UpdateNsxtSecurityPolicyRuleForm'
                      }
                    },
                    :klass => ApplicationHelper::Button::BelongsToAnyNsxtNetworkManager
                  ),
                  button(
                    :security_policy_rule_delete,
                    'pficon pficon-delete fa-lg',
                    t = N_('Remove Security Policy Rule (NSX-T)'),
                    t,
                    :data => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :controller     => 'provider_dialogs',
                        :button         => :nsxt_delete_security_policy_rule,
                        :modal_title    => N_('Remove Security Policy Rule'),
                        :component_name => 'DeleteNsxtSecurityPolicyRuleForm'
                      }
                    },
                    :klass => ApplicationHelper::Button::BelongsToAnyNsxtNetworkManager
                  ),
                ]
              )
            ]
          )
        end
      end
    end
  end
end