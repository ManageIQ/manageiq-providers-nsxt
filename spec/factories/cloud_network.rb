FactoryBot.define do
  factory :cloud_network_nsxt,
          :class  => "ManageIQ::Providers::Nsxt::NetworkManager::CloudNetwork",
          :parent => :cloud_network
end
