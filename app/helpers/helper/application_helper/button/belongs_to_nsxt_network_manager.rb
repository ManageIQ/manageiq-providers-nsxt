class ApplicationHelper::Button::BelongsToNsxtNetworkManager < ApplicationHelper::Button::Basic
  needs(:@record)

  def visible?
    @record.class.module_parent == ManageIQ::Providers::Nsxt::NetworkManager
  end
end
