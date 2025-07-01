module ManageIQ
  module Providers
    module Nsxt
      class Engine < ::Rails::Engine
        isolate_namespace ManageIQ::Providers::Nsxt

        config.autoload_paths << root.join('lib').to_s
        config.autoload_paths << root.join('app/helpers/helper').to_s

        def self.vmdb_plugin?
          true
        end

        def self.plugin_name
          _('VMware NSX-T Provider')
        end

        def self.init_loggers
          $nsxt_log ||= Vmdb::Loggers.create_logger("nsxt.log")
        end

        def self.apply_logger_config(config)
          Vmdb::Loggers.apply_config_value(config, $nsxt_log, :level_nsxt)
        end
      end
    end
  end
end
