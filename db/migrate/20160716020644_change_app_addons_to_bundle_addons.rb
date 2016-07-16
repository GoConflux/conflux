class ChangeAppAddonsToBundleAddons < ActiveRecord::Migration
  def change
    rename_table :app_addons, :bundle_addons
  end
end
