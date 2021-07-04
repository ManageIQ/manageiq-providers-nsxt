module ManageIQ::Providers
  class Nsxt::NetworkManager::Refresher < ManageIQ::Providers::BaseManager::Refresher
    def parse_legacy_inventory(ems)
      raise NotImplementedError, 'legacy refresh is no longer supported'
    end

    def post_process_refresh_classes
      [CloudTenant]
    end
  end
end
