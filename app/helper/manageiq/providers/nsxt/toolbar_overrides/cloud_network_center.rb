module ManageIQ
  module Providers
    module Nsxt
      module ToolbarOverrides
        class CloudNetworkCenter < ::ApplicationHelper::Toolbar::Override
          button_group(
            'cloud_network_vmdb',
            [
              select(
                :cloud_network_vmdb_choice,
                'fa fa-cog fa-lg',
                t = N_('Configuration'),
                t,
                :items => [
                  button(
                    :cloud_network_edit,
                    'pficon pficon-edit fa-lg',
                    t = N_('Edit this Cloud Network (NSX-T)'),
                    t,
                    :data  => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :controller     => 'provider_dialogs',
                        :button         => :nsxt_update_cloud_network,
                        :modal_title    => N_('Update Cloud Network'),
                        :component_name => 'UpdateNsxtCloudNetworkForm'
                      }
                    },
                    :klass => ApplicationHelper::Button::BelongsToNsxtNetworkManager
                  ),
                  button(
                    :cloud_network_delete,
                    'pficon pficon-delete fa-lg',
                    t = N_('Delete this Cloud Network'),
                    t,
                    :data  => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :controller     => 'provider_dialogs',
                        :button         => :nsxt_delete_cloud_network,
                        :modal_title    => N_('Remove Cloud Network'),
                        :component_name => 'DeleteNsxtCloudNetworkForm'
                      }
                    },
                    :klass => ApplicationHelper::Button::BelongsToNsxtNetworkManager
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