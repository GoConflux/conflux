class AddActiveRecordRelationshipFields < ActiveRecord::Migration
  def change
    add_column :pipelines, :team_id, :integer, index: true
    add_column :tiers, :pipeline_id, :integer, index: true
    add_column :apps, :tier_id, :integer, index: true
    add_column :keys, :app_addon_id, :integer, index: true
  end
end
