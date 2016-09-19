class CreateAddonLikes < ActiveRecord::Migration
  def change
    create_table :addon_likes do |t|
      t.integer :addon_id
      t.integer :user_id
    end
  end
end