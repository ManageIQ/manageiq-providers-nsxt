if ENV['CI']
  require 'simplecov'
  SimpleCov.start
end

Dir[Rails.root.join("spec/shared/**/*.rb")].each { |f| require f }
Dir[File.join(__dir__, "support/**/*.rb")].each { |f| require f }

require "manageiq/providers/nsxt"

VCR.configure do |config|
  config.ignore_hosts 'codeclimate.com' if ENV['CI']
  config.cassette_library_dir = File.join(ManageIQ::Providers::Nsxt::Engine.root, 'spec/vcr_cassettes')
  config.define_cassette_placeholder(Rails.application.secrets.nsxt_defaults[:hostname]) do
    Rails.application.secrets.nsxt[:hostname]
  end
end
