class AppAddonsController < ApplicationController
  include AppsHelper

  before_filter :set_current_user
  before_filter :set_app_addon, :only => [:index]
  before_filter :protect_app_addon, :only => [:index]
  before_filter :required_app_addon_creation_params, :only => [:create]
  before_filter :required_app_addon_update_params, :only => [:update]
  before_filter :required_app_addon_destroy_params, :only => [:destroy]
  before_filter :addon_by_uuid, :only => [:create]
  before_filter :app_by_uuid, :only => [:create]
  before_filter :app_addon_by_uuid, :only => [:update, :update_plan, :update_description, :destroy, :sso]

  def index
    addon = @app_addon.addon

    data = {
      name: addon.name,
      icon: addon.icon,
      description: @app_addon.description || addon.tagline,
      keys: @app_addon.keys_for_app_addon_view,
      app_uuid: @app_addon.app_scope.app.uuid,
      addon_uuid: addon.uuid,
      app_addon_uuid: @app_addon.uuid,
      plan_data: {
        selected: addon.index_for_plan(@app_addon.plan),
        plans: addon.plans
      },
      links: @app_addon.links,
      write_access: @current_team_user.can_edit_addon?(@app_addon)
    }

    pipeline = @app_addon.app_scope.app.tier.pipeline

    configure_menu_data(pipeline.team, selected_pipeline_slug: pipeline.slug)
    configure_header_data(app_addon: @app_addon)

    render component: 'AppAddon', props: data
  end

  def create
    scope = params[:scope] || 0

    addons_for_scope = @app.app_addons
      .includes(:app_scope, :addon)
      .where(app_scopes: { scope: scope })
      .map { |app_addon| app_addon.addon.id }

    # Return if app_scope already has that addon
    if addons_for_scope.include?(@addon.id)
      render json: { addon_already_exists: true }, status: 500
      return
    end

    plan = params[:plan]

    # If no plan passed in or the plan passed in isn't actually valid, default to the basic plan.
    if plan.nil? || !@addon.has_plan?(plan)
      plan = @addon.basic_plan_slug
    end

    if @addon.plan_disabled?(plan)
      render json: { message: 'Plan Not Available' }, status: 500
      return
    end

    # Ensure @current_team_user has write permissions to this app
    protect_app(true)

    case scope
      when AppScope::SHARED
        app_scope = @app.shared_app_scope
      when AppScope::PERSONAL
        app_scope = personal_app_scope  # find_or_create_by
    end

    assert(app_scope)

    begin
      with_transaction do
        app_addon = AppAddon.create!(
          app_scope_id: app_scope.id,
          addon_id: @addon.id,
          plan: plan
        )

        AppServices::ProvisionAppAddon.new(
          @current_user,
          app_addon,
          plan
        ).delay.perform

        # Remove all keys from Redis mapping to each of these apps
        # AppServices::RemoveAppKeysFromRedis.new(
        #   @current_user,
        #   @app
        # ).delay.perform

        track('New Add-on', { addon: @addon.slug })

        render json: {
          monthly_cost: "$#{'%.2f' % @app.est_monthly_cost}",
          addons: addons_for_app_view
        }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonCreationFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update
    begin
      with_transaction do
        @app_addon.update_attributes(allowed_update_params_for(:app_addon, params))

        if params[:keys].present?
          @app_addon.update_keys(params[:keys])

          # Remove all keys from Redis mapping to each of these apps
          # AppServices::RemoveAppKeysFromRedis.new(
          #   @current_user,
          #   @app_addon.app_scope.app
          # ).delay.perform
        end

        updated_data = {
          description: @app_addon.description || @app_addon.addon.tagline,
          keys: @app_addon.keys_for_app_addon_view
        }

        render json: updated_data
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update_plan
    addon = @app_addon.addon
    plan = params[:plan]

    if @app_addon.plan == plan
      render json: { message: 'Plan Already Selected' }, status: 500
      return
    end

    if addon.plan_disabled?(plan) || !addon.has_plan?(plan)
      render json: { message: 'Plan Not Available' }, status: 500
      return
    end

    begin
      with_transaction do
        @app_addon.update_attributes(plan: plan)

        AppServices::ChangeAddonPlan.new(
          @current_user,
          @app_addon,
          plan
        ).delay.perform

        track('Update Add-on Plan', { addon: addon.slug, plan: plan })

        render json: { selected: addon.index_for_plan(plan) }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update_description
    begin
      with_transaction do
        @app_addon.update_attributes(description: params[:description])
        render json: {}
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def destroy
    begin
      app = @app_addon.app_scope.app
      addon = @app_addon.addon

      @app_addon.destroy!

      # AppServices::RemoveAppKeysFromRedis.new(
      #   @current_user,
      #   app
      # ).perform

      track('Remove Add-on', { addon: addon.slug })

      render json: { url: app.create_link }
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonDestroyFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def sso
    protect_app_addon
    Sso.new(@app_addon).perform
    # Need to be able to follow the redirect that Mechanize is getting when posting,
    # but that doesn't seem to want to happen...
  end

end