module ManageIQ::Providers::Nsxt
  class NetworkManager::CloudNetwork < ::CloudNetwork
    def self.display_name(number = 1)
      n_('Cloud Network (NSX-T)', 'Cloud Networks (NSX-T)', number)
    end

    def self.nsxt_type
      :segment
    end

    def self.refresh_type
      :cloud_networks
    end
  end
end
