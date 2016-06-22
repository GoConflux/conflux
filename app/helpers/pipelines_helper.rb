module PipelinesHelper

  def tiers_for_pipeline_view
    @pipeline.tiers.order(:stage).map { |tier|
      {
        name: tier.name,
        stage: tier.stage,
        uuid: tier.uuid,
        apps: apps_for_tier(tier)
      }
    }
  end

  def apps_for_tier(tier)
    if tier.is_prod?
      @current_team_user.can_read_production_apps? ? tier.apps_for_tier_view : []
    else
      tier.apps_for_tier_view
    end
  end

end