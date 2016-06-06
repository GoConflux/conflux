class AddIconToTeams < ActiveRecord::Migration
  def change
    add_column :teams, :icon, :string
  end
end
