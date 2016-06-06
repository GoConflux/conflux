class CreateTeamUsers < ActiveRecord::Migration
  def change
    create_table :team_users do |t|
      t.string :uuid, index: true
      t.integer :team_id
      t.integer :user_id
      t.boolean :is_admin, default: false
      t.boolean :is_owner, default: false

      t.boolean :is_destroyed, default: false, index: true
      t.timestamps
    end

    add_index :team_users, [:team_id, :user_id], unique: true
  end
end
