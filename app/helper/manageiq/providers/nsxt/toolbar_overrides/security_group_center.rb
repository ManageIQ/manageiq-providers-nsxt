module ManageIQ
  module Providers
    module Nsxt
      module ToolbarOverrides
        class SecurityGroupCenter < ::ApplicationHelper::Toolbar::Override
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
                    :security_group_edit,
                    'pficon pficon-edit fa-lg',
                    t = N_('Edit Security Group'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_update_security_group,
                                                   :modal_title    => N_('Update Security Group'),
                                                   :component_name => 'UpdateNsxtSecurityGroupForm'}},
                    :klass => ApplicationHelper::Button::Basic
                  ),
                  button(
                    :security_group_delete,
                    'pficon pficon-delete fa-lg',
                    t = N_('Remove Security Group'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_delete_security_group,
                                                   :modal_title    => N_('Remove Security Group'),
                                                   :component_name => 'DeleteNsxtSecurityGroupForm'}},
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