class AddPlanToAppAddons < ActiveRecord::Migration
  def change
    add_column :app_addons, :plan, :string
  end
end
