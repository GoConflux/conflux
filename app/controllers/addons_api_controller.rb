class AddonsApiController < ApplicationController

  before_filter :set_app_conditional, :only => [:for_app]

  def for_app
    addons = @app.app_addons.includes(:addon).order('addons.slug').map { |app_addon|
      addon = app_addon.addon
      plan = app_addon.plan

      {
        'slug' => addon.slug,
        'name' => addon.name,
        'plan' => plan,
        'cost' => addon.cost_for_plan(plan)
      }
    }

    EventService.new(
      @current_user,
      'CLI - Fetch Add-ons for App',
      props: { app: @app.slug }
    ).delay.perform

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

    EventService.new(@current_user, 'CLI - Fetch All Add-ons').delay.perform

    render json: addons, status: 200
  end

  def plans
    addon = Addon.find_by(slug: params[:addon_slug])
    assert(addon)

    EventService.new(
      @current_user,
      'CLI - Fetch Plans for Add-on',
      props: { addon: addon.slug }
    ).delay.perform

    render json: addon.formatted_plans
  end

end