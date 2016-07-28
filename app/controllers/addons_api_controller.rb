class AddonsApiController < ApplicationController

  before_filter :set_app_conditional, :only => [:for_app]

  def for_app
    @current_team_user = TeamUser.find_by(team_id: @app.tier.pipeline.team.id, user_id: @current_user.id)
    assert(@current_team_user)

    addons = @app.app_addons
      .includes(:app_scope, :addon)
      .where(app_scopes: { team_user_id: [nil, @current_team_user.id] })
      .map { |app_addon|
        addon = app_addon.addon
        plan = app_addon.plan

        {
          'slug' => addon.slug,
          'name' => addon.name,
          'scope' => app_addon.app_scope.scope == AppScope::PERSONAL ? 'Personal' : 'Shared',
          'plan' => plan,
          'cost' => addon.cost_for_plan(plan)
        }
      }.sort_by { |a| [a['scope'], a['slug']] }

    track('CLI - Fetch Add-ons for App', { app: @app.slug })

    render json: addons, status: 200
  end

  def all
    addons = Addon.all.order(:slug).map { |addon|
      {
        'slug' => addon.slug,
        'name' => addon.name,
        'description' => addon.tagline
      }
    }

    track('CLI - Fetch All Add-ons')

    render json: addons, status: 200
  end

  def plans
    addon = Addon.find_by(slug: params[:addon_slug])
    assert(addon)

    track('CLI - Fetch Plans for Add-on', { addon: addon.slug })

    render json: addon.formatted_plans
  end

end