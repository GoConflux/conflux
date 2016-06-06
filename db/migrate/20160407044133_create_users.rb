class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :uuid, index: true
      t.string :name
      t.string :email, index: true
      t.string :password
      t.string :pic

      t.boolean :is_destroyed, default: false, index: true
      t.timestamps
    end
  end
end
