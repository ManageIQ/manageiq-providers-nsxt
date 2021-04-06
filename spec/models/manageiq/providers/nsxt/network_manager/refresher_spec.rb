describe ManageIQ::Providers::Nsxt::NetworkManager::Refresher do
  it ".ems_type" do
    expect(described_class.ems_type).to eq(:nsxt)
  end

  context "#refresh" do
    let(:ems) do
      hostname = Rails.application.secrets.nsxt.try(:[], :hostname) || "nsxthostname"
      username = Rails.application.secrets.nsxt.try(:[], :username) || "NSXT_USERNAME"
      password = Rails.application.secrets.nsxt.try(:[], :password) || "NSXT_PASSWORD"

      FactoryBot.create(:ems_nsxt_network, :hostname => hostname, :security_protocol => 'ssl', :endpoint_path => 'policy/api/v1/infra').tap do |ems|
        ems.authentications << FactoryBot.create(:authentication, :userid => username, :password => password)
      end
    end

    it "full refresh" do
      2.times do
        VCR.use_cassette(described_class.name.underscore) { EmsRefresh.refresh(ems) }
        ems.reload

        assert_table_counts
        assert_specific_network_service
        assert_specific_cloud_network
        assert_specific_cloud_subnet
        assert_specific_network_router
        assert_specific_security_group
        assert_specific_security_policy
        assert_specific_security_policy_rule
      end
    end

    def assert_table_counts
      expect(CloudNetwork.count).to        eq(32)
      expect(CloudSubnet.count).to         eq(33)
      expect(NetworkService.count).to      eq(410)
      expect(NetworkServiceEntry.count).to eq(802)
      expect(NetworkRouter.count).to       eq(10)
      expect(SecurityGroup.count).to       eq(48)
      expect(SecurityPolicy.count).to      eq(25)
      expect(SecurityPolicyRule.count).to  eq(39)
    end

    def assert_specific_network_service
      network_service = ems.network_services.find_by(:ems_ref => "AD_Server")

      expect(network_service).to have_attributes(
        :type        => "ManageIQ::Providers::Nsxt::NetworkManager::NetworkService",
        :name        => "AD Server",
        :description => "AD Server",
        :ems_ref     => "AD_Server"
      )

      expect(network_service.network_service_entries.count).to eq(1)
      expect(network_service.network_service_entries.first).to have_attributes(
        :type              => "ManageIQ::Providers::Nsxt::NetworkManager::NetworkServiceEntry",
        :name              => "AD Server",
        :description       => nil,
        :ems_ref           => "AD_Server-AD_Server",
        :protocol          => "TCP",
        :source_ports      => "ANY",
        :destination_ports => "1024"
      )
    end

    def assert_specific_cloud_network
      cloud_network = ems.cloud_networks.first
      expect(cloud_network).to have_attributes(
        :name        => "192.168.12.0",
        :ems_ref     => "d5204c40-6a90-11ea-a5b5-f9815823238c",
        :cidr        => nil,
        :status      => "active",
        :enabled     => true,
        :type        => "ManageIQ::Providers::Nsxt::NetworkManager::CloudNetwork",
        :description => nil
      )
    end

    def assert_specific_cloud_subnet
      cloud_subnet = ems.cloud_subnets.find_by(:ems_ref => "d5204c40-6a90-11ea-a5b5-f9815823238c-192.168.12.0/24")

      expect(cloud_subnet).to have_attributes(
        :name         => "192.168.12.0-192.168.12.0/24",
        :ems_ref      => "d5204c40-6a90-11ea-a5b5-f9815823238c-192.168.12.0/24",
        :cidr         => "192.168.12.0/24",
        :dhcp_enabled => false,
        :gateway      => "192.168.12.1",
        :type         => "ManageIQ::Providers::Nsxt::NetworkManager::CloudSubnet",
      )

      expect(cloud_subnet.network_router&.ems_ref).to eq("T1-imro")
    end

    def assert_specific_network_router
      network_router = ems.network_routers.find_by(:ems_ref => "T1-imro")

      expect(network_router).to have_attributes(
        :name    => "T1-imro",
        :ems_ref => "T1-imro",
        :status  => "active",
      )

      expect(network_router.cloud_subnets.count).to eq(2)
      expect(network_router.cloud_subnets.pluck(:ems_ref)).to include("d5204c40-6a90-11ea-a5b5-f9815823238c-192.168.12.1/24")
    end

    def assert_specific_security_group
      security_group = ems.security_groups.find_by(:ems_ref => "DHCP-imro")
      expect(security_group).to have_attributes(
        :name        => "DHCP-imro",
        :description => nil,
        :type        => "ManageIQ::Providers::Nsxt::NetworkManager::SecurityGroup",
        :ems_ref     => "DHCP-imro"
      )
    end

    def assert_specific_security_policy
      security_policy = ems.security_policies.find_by(:ems_ref => "e2bc6e10-6a27-11ea-98a6-5d1d088ebb0c")
      expect(security_policy).to have_attributes(
        :type            => "ManageIQ::Providers::Nsxt::NetworkManager::SecurityPolicy",
        :name            => "DHCP",
        :description     => nil,
        :ems_ref         => "e2bc6e10-6a27-11ea-98a6-5d1d088ebb0c",
        :sequence_number => 10
      )

      expect(security_policy.security_policy_rules.count).to eq(1)
      expect(security_policy.security_policy_rules.pluck(:ems_ref)).to include("1717e720-6a28-11ea-98a6-5d1d088ebb0c")
    end

    def assert_specific_security_policy_rule
      security_policy_rule = ems.security_policy_rules.find_by(:ems_ref => "1717e720-6a28-11ea-98a6-5d1d088ebb0c")

      expect(security_policy_rule).to have_attributes(
        :type            => "ManageIQ::Providers::Nsxt::NetworkManager::SecurityPolicyRule",
        :name            => "DHCP-all",
        :description     => nil,
        :ems_ref         => "1717e720-6a28-11ea-98a6-5d1d088ebb0c",
        :sequence_number => 10,
        :status          => "active",
        :action          => "ALLOW",
        :direction       => "IN_OUT",
        :ip_protocol     => "IPV4_IPV6"
      )

      expect(security_policy_rule.security_policy&.ems_ref).to eq("e2bc6e10-6a27-11ea-98a6-5d1d088ebb0c")
    end
  end
end
