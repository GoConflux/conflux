class AddRoleIdToTeamUsers < ActiveRecord::Migration
  def change
    add_column :team_users, :role, :integer
  end
end