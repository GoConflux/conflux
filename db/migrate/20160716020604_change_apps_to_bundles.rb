class ChangeAppsToBundles < ActiveRecord::Migration
  def change
    rename_table :apps, :bundles
  end
end
