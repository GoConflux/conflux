class AddCanAccessNonFreePlansToUsers < ActiveRecord::Migration
  def change
    add_column :users, :can_access_non_free_plans, :boolean, default: false
  end
end
