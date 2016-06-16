class CreateAddonCategories < ActiveRecord::Migration
  def change
    create_table :addon_categories do |t|
      t.string :category, index: true, unique: true
    end
  end
end
