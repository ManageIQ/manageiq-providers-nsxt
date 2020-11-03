class ApplicationHelper::Button::AnyNsxtNetworkManager < ApplicationHelper::Button::Basic
  def visible?
    Rbac.filtered(ManageIQ::Providers::Nsxt::NetworkManager).any?
  end
end
