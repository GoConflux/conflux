class AddTokenToApp < ActiveRecord::Migration
  def change
    add_column :apps, :token, :string, index: true
  end
end
