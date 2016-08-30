class AddUuidToAddonCategories < ActiveRecord::Migration
  def change
    add_column :addon_categories, :uuid, :string, index: true
  end
end
