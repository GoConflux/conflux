class CreateAddons < ActiveRecord::Migration
  def change
    create_table :addons do |t|
      t.string :uuid, index: true
      t.string :name
      t.text :description
      t.string :icon
      t.string :slug, index: true

      t.boolean :is_destroyed, default: false, index: true
      t.timestamps
    end
  end
end
