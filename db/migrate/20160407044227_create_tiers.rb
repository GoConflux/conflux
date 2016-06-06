class CreateTiers < ActiveRecord::Migration
  def change
    create_table :tiers do |t|
      t.string :uuid, index: true
      t.string :name
      t.integer :stage

      t.boolean :is_destroyed, default: false, index: true
      t.timestamps
    end
  end
end