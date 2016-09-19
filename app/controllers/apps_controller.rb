class AppsController < ApplicationController
  include AppsHelper

  before_filter :set_current_user
  before_filter :set_app, :only => [:index]
  before_filter :protect_app, :only => [:index]
  before_filter :required_app_creation_params, :only => [:create]
  before_filter :tier_by_uuid, :only => [:create]
  before_filter :required_app_update_params, :only => [:update]
  before_filter :required_app_destroy_params, :only => [:destroy]
  before_filter :app_by_uuid, :only => [:update, :destroy]
  before_filter :pipeline_by_uuid, :only => [:clone]

  def index
    data = {
      name: @app.name,
      app_uuid: @app.uuid,
      tier_stage: @app.tier.stage,
      addons: addons_for_app_view,
      monthly_cost: "$#{'%.2f' % @app.est_monthly_cost}",
      api_key: @app.token,
      can_bump_to_prod: @current_team_user.can_write_production_apps?,
      write_access: @current_team_user.can_edit_app?(@app)
    }

    pipeline = @app.tier.pipeline

    configure_menu_data(pipeline.team, selected_pipeline_slug: pipeline.slug)

    configure_header_data(app: @app)

    render component: 'App', props: data
  end

  def create
    begin
      with_transaction do
        create_new_app({
          name: params[:name],
          description: params[:description],
          token: UUIDTools::UUID.random_create.to_s,
          tier_id: @tier.id
        })

        track('New Bundle', { team: @tier.pipeline.team.slug })

        render json: {
          updated_tier: @tier.uuid,
          apps: @tier.apps_for_tier_view
        }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppCreationFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update
    begin
      with_transaction do
        if @app.tier.stage != params[:stage]
          apps_new_tier = @app.tier.pipeline.tiers.where(stage: params[:stage]).take

          if apps_new_tier.present?
            params[:tier_id] = apps_new_tier.id
          end
        end

        @app.assign_attributes(allowed_update_params_for(:app, params))

        response_data = { name: @app.name }

        respond_with_new_url = @app.name_changed?

        if @app.name_changed?
          @app.slug = nil
          @app.save!

          @app.generate_slug
        end

        @app.save!

        response_data[:url] = @app.create_link if respond_with_new_url

        render json: response_data
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def destroy
    begin
      with_transaction do
        pipeline = @app.tier.pipeline
        token_placeholder_app = App.new(token: @app.token)

        @app.destroy!

        # Remove all keys from Redis mapping to each of these apps
        # AppServices::RemoveAppKeysFromRedis.new(
        #   @current_user,
        #   token_placeholder_app
        # ).delay.perform

        track('Delete Bundle', { app: @app.slug })

        render json: {
          url: pipeline.create_link
        }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppDestroyFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def name_available
    app = params[:app_uuid].present? ? App.find_by(uuid: params[:app_uuid]) : nil

    available = is_name_available(App, params[:name], app)

    render json: { available: available }
  end

  def clone_info
    app = App.includes(:tier => [:pipeline => :team]).find_by(uuid: params[:app_uuid])
    assert(app, StatusCodes::AppNotFound)

    if app.addons.count == 0
      render json: { no_addons: true }
      return
    end

    current_team_user = TeamUser.find_by(user_id: @current_user.id, team_id: app.tier.pipeline.team.id)

    render json: {
      addons: app.clone_info,
      includeProd: current_team_user.can_write_production_apps?,
      sourceAppTierIndex: app.tier.stage,
      pipeline_uuid: app.tier.pipeline.uuid
    }
  end

  def clone
    tier = @pipeline.tiers.find_by(stage: params[:tierStage])
    assert(tier)

    addons_info = params[:addons] || []
    addon_uuids = addons_info.map { |info| info[:addon_uuid] }
    addons = Addon.where(uuid: addon_uuids)

    begin
      with_transaction do
        app, shared_app_scope = create_new_app({
          name: params[:name],
          token: UUIDTools::UUID.random_create.to_s,
          tier_id: tier.id
        })

        team_slug = @pipeline.team.slug

        track('Cloned Bundle', { team: team_slug })

        addons.each { |addon|
          # For later:
          # plan_slug = addons_info.find { |info| info[:addon_uuid] == addon.uuid  }.try(:plan)
          # plan = "#{addon.slug}:#{plan_slug}"
          plan = addon.basic_plan

          app_addon = AppAddon.new(
            app_scope_id: shared_app_scope.id,
            addon_id: addon.id,
            plan: plan
          )

          app_addon.save!

          AppServices::ProvisionAppAddon.new(
            @current_user,
            app_addon,
            plan
          ).delay.perform
        }

        render json: { url: "/#{team_slug}/#{@pipeline.slug}/#{app.slug}" }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppCreationFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

end