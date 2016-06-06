class CreateUserTokens < ActiveRecord::Migration
  def change
    create_table :user_tokens do |t|
      t.integer  :user_id, index: true
      t.string   :token, index: true, unique: true
      t.boolean  :expired, default: false

      t.timestamps
    end
  end
end
