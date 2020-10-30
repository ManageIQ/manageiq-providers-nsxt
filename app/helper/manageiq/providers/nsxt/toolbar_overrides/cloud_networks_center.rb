module ManageIQ
  module Providers
    module Nsxt
      module ToolbarOverrides
        class CloudNetworksCenter < ::ApplicationHelper::Toolbar::Override
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
                    :cloud_network_new,
                    'pficon pficon-add-circle-o fa-lg',
                    t = N_('Add a new Cloud Network (NSX-T)'),
                    t,
                    :data  => {
                      'function'      => 'sendDataWithRx',
                      'function-data' => {
                        :controller     => 'provider_dialogs',
                        :button         => :nsxt_create_cloud_network,
                        :modal_title    => N_('Add Cloud Network (NSX-T)'),
                        :component_name => 'CreateNsxtCloudNetworkForm'
                      }
                    },
                    :klass => ApplicationHelper::Button::AnyNsxtNetworkManager
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