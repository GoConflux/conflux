class AddAddonCategoryIdToAddon < ActiveRecord::Migration
  def change
    add_column :addons, :addon_category_id, :integer, index: true
  end
end