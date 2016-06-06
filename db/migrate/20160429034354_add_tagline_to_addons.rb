class AddTaglineToAddons < ActiveRecord::Migration
  def change
    add_column :addons, :tagline, :string
  end
end
