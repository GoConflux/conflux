class PartnerizeAppAddon < ActiveRecord::Migration
  def change
    add_column :app_addons, :external_uuid, :string
    add_column :app_addons, :external_username, :string
  end
end
