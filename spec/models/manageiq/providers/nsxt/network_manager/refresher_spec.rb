describe ManageIQ::Providers::Nsxt::NetworkManager::Refresher do
  it ".ems_type" do
    expect(described_class.ems_type).to eq(:nsxt)
  end
end
