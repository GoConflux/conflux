class CreateTeams < ActiveRecord::Migration
  def change
    create_table :teams do |t|
      t.string :uuid, index: true
      t.string :name
      t.string :slug, index: true

      t.boolean :is_destroyed, default: false, index: true
      t.timestamps
    end
  end
end
