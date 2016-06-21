class RemoveIsAdminAndIsOwnerFromTeamUsers < ActiveRecord::Migration
  def change
    remove_column :team_users, :is_admin
    remove_column :team_users, :is_owner
  end
end
