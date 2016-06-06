class CreateKeys < ActiveRecord::Migration
  def change
    create_table :keys do |t|
      t.string :uuid, index: true
      t.text :name, index: true
      t.text :value
      t.text :description

      t.timestamps
    end
  end
end
