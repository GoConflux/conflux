class AddHerokuAliasToAddons < ActiveRecord::Migration
  def change
    add_column :addons, :heroku_alias, :string
  end
end
