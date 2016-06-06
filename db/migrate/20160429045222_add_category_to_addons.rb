class AddCategoryToAddons < ActiveRecord::Migration
  def change
    add_column :addons, :category, :string, index: true
  end
end
