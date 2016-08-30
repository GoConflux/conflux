class AddIsDestroyedToAddonAdmins < ActiveRecord::Migration
  def change
    add_column :addon_admins, :is_destroyed, :boolean, default: false, index: true
  end
end
