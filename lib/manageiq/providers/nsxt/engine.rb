module ManageIQ
  module Providers
    module Nsxt
      class Engine < ::Rails::Engine
        isolate_namespace ManageIQ::Providers::Nsxt

        config.autoload_paths << root.join('lib').to_s

        def self.vmdb_plugin?
          true
        end

        def self.plugin_name
          _('VMware NSX-T Provider')
        end
      end
    end
  end
end
