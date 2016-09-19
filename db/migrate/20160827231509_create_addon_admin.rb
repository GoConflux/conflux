class CreateAddonAdmin < ActiveRecord::Migration
  def change
    create_table :addon_admins do |t|
      t.integer :addon_id
      t.integer :user_id
      t.boolean :is_owner, default: false
      t.timestamps
    end

    add_index :addon_admins, [:addon_id, :user_id]
  end
end