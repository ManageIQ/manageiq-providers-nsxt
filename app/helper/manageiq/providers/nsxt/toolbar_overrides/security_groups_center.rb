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
                    t = N_('Add Security Group'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nsxt_create_security_group,
                                                   :modal_title    => N_('Add Security Group'),
                                                   :component_name => 'CreateNsxtSecurityGroupForm'}},
                    :klass => ApplicationHelper::Button::Basic
                  ),
                  button(
                    :security_group_delete,
                    'pficon pficon-delete fa-lg',
                    t = N_('Delete selected Security Groups'),
                    t,
                    :url_parms    => 'main_div',
                    :send_checked => true,
                    :confirm      => N_('Warning: The selected Security Groups and their VM references will be permanently removed!'),
                    :enabled      => false,
                    :onwhen       => "1+",
                    :data         => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :type       => 'delete',
                        :controller => 'toolbarActions',
                        :payload    => {
                          :entity => 'security_groups',
                          :labels => {
                            :single   => _('Security Group'),
                            :multiple => _('Security Groups')
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