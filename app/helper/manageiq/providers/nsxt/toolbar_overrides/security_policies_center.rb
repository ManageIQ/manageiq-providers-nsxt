module ManageIQ
  module Providers
    module Nsxt
      module ToolbarOverrides
        class SecurityPoliciesCenter < ::ApplicationHelper::Toolbar::Override
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
                    :security_policy_new,
                    'pficon pficon-add-circle-o fa-lg',
                    t = N_('Add Security Policy'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_create_security_policy,
                                                   :modal_title    => N_('Add Security Policy'),
                                                   :component_name => 'CreateNsxtSecurityPolicyForm'}},
                    :klass => ApplicationHelper::Button::Basic
                  ),
                  button(
                    :security_policy_delete,
                    'pficon pficon-delete fa-lg',
                    t = N_('Delete selected Security Policies'),
                    t,
                    :url_parms    => 'main_div',
                    :send_checked => true,
                    :confirm      => N_('Warning: The selected Security Policies and their Security Policy Rules will be permanently removed!'),
                    :enabled      => false,
                    :onwhen       => "1+",
                    :data         => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :type       => 'delete',
                        :controller => 'toolbarActions',
                        :payload    => {
                          :entity => 'security_policies',
                          :labels => {
                            :single   => _('Security Policy'),
                            :multiple => _('Security Policies')
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