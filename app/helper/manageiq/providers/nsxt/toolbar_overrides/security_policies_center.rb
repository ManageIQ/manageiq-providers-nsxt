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
                    t = N_('Add Security Policy (NSX-T)'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_create_security_policy,
                                                   :modal_title    => N_('Add Security Policy (NSX-T)'),
                                                   :component_name => 'CreateNsxtSecurityPolicyForm'}},
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