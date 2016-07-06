class AddPreventDeprovisionToAddons < ActiveRecord::Migration
  def change
    add_column :addons, :prevent_deprovision, :boolean, default: false
  end
end