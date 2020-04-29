describe ManageIQ::Providers::Nsxt::NetworkManager::Refresher do
  it ".ems_type" do
    expect(described_class.ems_type).to eq(:nsxt)
  end

  context "#refresh" do
    let(:ems) do
      hostname = Rails.application.secrets.nsxt.try(:[], :hostname) || "nsxthostname"
      username = Rails.application.secrets.nsxt.try(:[], :username) || "NSXT_USERNAME"
      password = Rails.application.secrets.nsxt.try(:[], :password) || "NSXT_PASSWORD"

      FactoryBot.create(:ems_nsxt, :hostname => hostname, :security_protocol => 'ssl').tap do |ems|
        ems.authentications << FactoryBot.create(:authentication, :userid => username, :password => password)
      end
    end

    it "full refresh" do
      2.times do
        VCR.use_cassette(described_class.name.underscore) { EmsRefresh.refresh(ems) }
        ems.reload

        assert_table_counts
      end
    end

    def assert_table_counts
      expect(ExtManagementSystem.count).to eq(1)
      # TODO: add more checks
    end
  end
end
