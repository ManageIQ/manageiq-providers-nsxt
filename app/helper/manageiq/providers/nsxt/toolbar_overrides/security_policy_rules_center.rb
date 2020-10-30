module ManageIQ
  module Providers
    module Nsxt
      module ToolbarOverrides
        class SecurityPolicyRulesCenter < ::ApplicationHelper::Toolbar::Override
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
                    :security_policy_rule_new,
                    'pficon pficon-add-circle-o fa-lg',
                    t = N_('Add Security Policy Rule (NSX-T)'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_create_security_policy_rule,
                                                   :modal_title    => N_('Add Security Policy Rule (NSX-T)'),
                                                   :component_name => 'CreateNsxtSecurityPolicyRuleForm'}},
                    :klass => ApplicationHelper::Button::AnyNsxtProvider
                  )
                ]
              )
            ]
          )
        end
      end
    end
  end
end