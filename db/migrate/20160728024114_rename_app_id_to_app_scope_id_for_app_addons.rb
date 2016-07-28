class RenameAppIdToAppScopeIdForAppAddons < ActiveRecord::Migration
  def change
    rename_column :app_addons, :app_id, :app_scope_id
  end
end
