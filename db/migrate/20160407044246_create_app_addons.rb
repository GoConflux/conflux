class CreateAppAddons < ActiveRecord::Migration
  def change
    create_table :app_addons do |t|
      t.string :uuid, index: true
      t.integer :app_id
      t.integer :addon_id
      t.text :description

      t.boolean :is_destroyed, default: false, index: true
      t.timestamps
    end

    add_index :app_addons, [:app_id, :addon_id]
  end
end
