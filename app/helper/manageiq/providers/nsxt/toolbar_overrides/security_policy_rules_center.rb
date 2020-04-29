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
                    t = N_('Add Security Policy Rule'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_create_security_policy_rule,
                                                   :modal_title    => N_('Add Security Policy Rule'),
                                                   :component_name => 'CreateNsxtSecurityPolicyRuleForm'}},
                    :klass => ApplicationHelper::Button::Basic
                  ),
                  button(
                    :security_policy_rule_delete,
                    'pficon pficon-delete fa-lg',
                    t = N_('Delete selected Security Policy Rules'),
                    t,
                    :url_parms    => 'main_div',
                    :send_checked => true,
                    :confirm      => N_('Warning: The selected Security Policy Rules and ALL of their components will be permanently removed!'),
                    :enabled      => false,
                    :onwhen       => "1+",
                    :data         => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :type       => 'delete',
                        :controller => 'toolbarActions',
                        :payload    => {
                          :entity => 'security_policy_rules',
                          :labels => {
                            :single   => _('Security Policy Rule'),
                            :multiple => _('Security Policy Rules')
                          }
                        }
                      }.to_json
                    }
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