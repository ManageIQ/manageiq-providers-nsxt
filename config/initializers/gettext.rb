Vmdb::Gettext::Domains.add_domain(
  'ManageIQ_Providers_Nsxt',
  ManageIQ::Providers::Nsxt::Engine.root.join('locale').to_s,
  :po
)
