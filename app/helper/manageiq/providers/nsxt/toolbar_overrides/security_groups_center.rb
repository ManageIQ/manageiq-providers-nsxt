module ManageIQ
  module Providers
    module Nsxt
      module ToolbarOverrides
        class SecurityGroupsCenter < ::ApplicationHelper::Toolbar::Override
          button_group(
            'security_group_vmdb',
            [
              select(
                :security_group_vmdb_choice,
                'fa fa-cog fa-lg',
                t = N_('Configuration'),
                t,
                :items => [
                  button(
                    :security_group_new,
                    'pficon pficon-add-circle-o fa-lg',
                    t = N_('Add Security Group (NSX-T)'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_create_security_group,
                                                   :modal_title    => N_('Add Security Group (NSX-T)'),
                                                   :component_name => 'CreateNsxtSecurityGroupForm'}},
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