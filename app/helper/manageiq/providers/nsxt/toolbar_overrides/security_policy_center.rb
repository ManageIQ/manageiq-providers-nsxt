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
                    t = N_('Edit Security Policy'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_update_security_policy,
                                                   :modal_title    => N_('Edit Security Policy'),
                                                   :component_name => 'UpdateNsxtSecurityPolicyForm'}},
                    :klass => ApplicationHelper::Button::Basic
                  ),
                  button(
                    :security_policy_delete,
                    'pficon pficon-delete fa-lg',
                    t = N_('Remove Security Policy'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_delete_security_policy,
                                                   :modal_title    => N_('Remove Security Policy'),
                                                   :component_name => 'DeleteNsxtSecurityPolicyForm'}},
                    :klass => ApplicationHelper::Button::Basic
                  ),
                  button(
                    :security_policy_rule_new,
                    'pficon pficon-add-circle-o fa-lg',
                    t = N_('Add Security Policy Rule'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_create_security_policy_rule,
                                                   :modal_title    => N_('Add Security Policy Rule'),
                                                   :component_name => 'CreateNsxtSecurityPolicyRuleForm'}},
                    :klass => ApplicationHelper::Button::Basic
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