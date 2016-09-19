class PartnerizeAddon < ActiveRecord::Migration
  def change
    add_column :addons, :status, :integer, index: true, default: -1
    add_column :addons, :url, :string
    add_column :addons, :password, :string
    add_column :addons, :sso_salt, :string
    add_column :addons, :configs, :json, default: []
    add_column :addons, :plans, :json, default: []
    add_column :addons, :features, :json, default: []
    add_column :addons, :jobs, :json, default: {}
    add_column :addons, :api, :json, default: {}
  end
end
