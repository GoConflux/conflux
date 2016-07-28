class AddAppScope < ActiveRecord::Migration
  def change
    create_table :app_scopes do |t|
      t.integer :app_id, index: true
      t.integer :scope, index: true
      t.integer :team_user_id, index: true
      t.string :heroku_app

      t.boolean :is_destroyed, default: false, index: true
      t.timestamps
    end
  end
end