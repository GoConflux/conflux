class CreateTeamUserTokens < ActiveRecord::Migration
  def change
    create_table :team_user_tokens do |t|
      t.integer  :team_user_id
      t.string   :token, index: true, unique: true
      t.boolean  :expired, default: false

      t.timestamps
    end
  end
end

