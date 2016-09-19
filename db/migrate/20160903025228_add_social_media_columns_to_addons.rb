class AddSocialMediaColumnsToAddons < ActiveRecord::Migration
  def change
    add_column :addons, :facebook_url, :string
    add_column :addons, :twitter_url, :string
    add_column :addons, :github_url, :string
  end
end
