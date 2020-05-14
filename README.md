# manageiq-providers-nsxt

[![Gem Version](https://badge.fury.io/rb/manageiq-providers-nsxt.svg)](http://badge.fury.io/rb/manageiq-providers-nsxt)
[![Build Status](https://travis-ci.com/ManageIQ/manageiq-providers-nsxt.svg)](https://travis-ci.com/ManageIQ/manageiq-providers-nsxt)
[![Code Climate](https://codeclimate.com/github/ManageIQ/manageiq-providers-nsxt.svg)](https://codeclimate.com/github/ManageIQ/manageiq-providers-nsxt)
[![Test Coverage](https://codeclimate.com/github/ManageIQ/manageiq-providers-nsxt/badges/coverage.svg)](https://codeclimate.com/github/ManageIQ/manageiq-providers-nsxt/coverage)
[![Security](https://hakiri.io/github/ManageIQ/manageiq-providers-nsxt/master.svg)](https://hakiri.io/github/ManageIQ/manageiq-providers-nsxt/master)

[![Chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ManageIQ/manageiq-providers-nsxt?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Translate](https://img.shields.io/badge/translate-zanata-blue.svg)](https://translate.zanata.org/zanata/project/view/manageiq-providers-nsxt)

ManageIQ plugin for VMware NSX-T.

## Development

See the section on pluggable providers in the [ManageIQ Developer Setup](http://manageiq.org/docs/guides/developer_setup)

For quick local setup run `bin/setup`, which will clone the core ManageIQ repository under the *spec* directory and setup necessary config files. If you have already cloned it, you can run `bin/update` to bring the core ManageIQ code up to date.

## License

The gem is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

ems = ManageIQ::Providers::Nsxt::NetworkManager.create!(:name => "nsxt", :hostname => "localhost", :zone_id => Zone.default_zone.id)
ems.update_authentication(:default => {:userid => "user", :password => "pw"})
ems.authentication_check

ems = ManageIQ::Providers::Nsxt::NetworkManager.first
ems.refresh
