FactoryBot.define do
  factory :ems_nsxt,
          :class => "ManageIQ::Providers::Nsxt::NetworkManager",
          :aliases => ["manageiq/providers/nsxt/network_manager"],
          :parent => :ems_network
end
