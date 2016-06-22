class AppsController < ApplicationController

  before_filter :set_current_user
  before_filter :set_app, :only => [:index]
  before_filter :required_app_creation_params, :only => [:create]
  before_filter :tier_by_uuid, :only => [:create]
  before_filter :required_app_update_params, :only => [:update]
  before_filter :required_app_destroy_params, :only => [:destroy]
  before_filter :app_by_uuid, :only => [:update, :destroy]

  def index
    @current_team_user = TeamUser.find_by(user_id: @current_user.id, team_id: @app.tier.pipeline.team.id)
    assert(@current_team_user)

    data = {
      name: @app.name,
      app_uuid: @app.uuid,
      tier_stage: @app.tier.stage,
      addons: @app.addons_for_app_view,
      monthly_cost: "$#{'%.2f' % @app.est_monthly_cost}",
      api_key: @app.token,
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
        App.create!(
          name: params[:name],
          description: params[:description],
          token: UUIDTools::UUID.random_create.to_s,
          tier_id: @tier.id
        )

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
        AppServices::RemoveAppKeysFromRedis.new(
          @current_user,
          token_placeholder_app
        ).delay.perform

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
    available = is_name_available(App, params[:name])
    render json: { available: available }
  end

end