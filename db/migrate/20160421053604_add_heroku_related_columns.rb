class AddHerokuRelatedColumns < ActiveRecord::Migration
  def change
    add_column :addons, :heroku_dependent, :boolean, default: false
    add_column :apps, :heroku_app, :string
  end
end
