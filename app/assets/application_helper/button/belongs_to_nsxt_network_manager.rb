class ApplicationHelper::Button::BelongsToNsxtNetworkManager < ApplicationHelper::Button::Basic
  needs(:@record)

  def visible?
    @record.class.parent == ManageIQ::Providers::Nsxt::NetworkManager
  end
end
