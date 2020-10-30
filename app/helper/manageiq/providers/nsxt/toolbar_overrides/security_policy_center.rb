module ManageIQ
  module Providers
    module Nsxt
      module ToolbarOverrides
        class SecurityPolicyCenter < ::ApplicationHelper::Toolbar::Override
          button_group(
            'security_policy_vmdb',
            [
              select(
                :security_policy_vmdb_choice,
                'fa fa-cog fa-lg',
                t = N_('Configuration'),
                t,
                :items => [
                  button(
                    :security_policy_edit,
                    'pficon pficon-delete fa-lg',
                    t = N_('Edit Security Policy (NSX-T)'),
                    t,
                    :data  => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :controller     => 'provider_dialogs',
                        :button         => :nsxt_update_security_policy,
                        :modal_title    => N_('Edit Security Policy (NSX-T)'),
                        :component_name => 'UpdateNsxtSecurityPolicyForm'
                      }
                    },
                    :klass => ApplicationHelper::Button::BelongsToAnyNsxtNetworkManager
                  ),
                  button(
                    :nsxt_security_policy_delete,
                    'pficon pficon-delete fa-lg',
                    t = N_('Remove Security Policy (NSX-T)'),
                    t,
                    :data  => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :controller     => 'provider_dialogs',
                        :button         => :nsxt_delete_security_policy,
                        :modal_title    => N_('Remove Security Policy'),
                        :component_name => 'DeleteNsxtSecurityPolicyForm'
                      }
                    },
                    :klass => ApplicationHelper::Button::BelongsToAnyNsxtNetworkManager
                  ),
                  button(
                    :nsxt_security_policy_rule_new,
                    'pficon pficon-add-circle-o fa-lg',
                    t = N_('Add Security Policy Rule (NSX-T)'),
                    t,
                    :data  => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :controller     => 'provider_dialogs',
                        :button         => :nsxt_create_security_policy_rule,
                        :modal_title    => N_('Add Security Policy Rule'),
                        :component_name => 'CreateNsxtSecurityPolicyRuleForm'
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