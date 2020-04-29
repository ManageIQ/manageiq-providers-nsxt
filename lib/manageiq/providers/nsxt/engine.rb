module ManageIQ
  module Providers
    module Nsxt
      class Engine < ::Rails::Engine
        isolate_namespace ManageIQ::Providers::Nsxt

        def self.vmdb_plugin?
          true
        end

        def self.plugin_name
          _('NSX-T Provider')
        end
      end
    end
  end
end
