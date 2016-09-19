class PipelinesController < ApplicationController
  include PipelinesHelper

  before_filter :set_current_user
  before_filter :set_pipeline, :only => [:index]
  before_filter :required_pipeline_creation_params, :only => [:create]
  before_filter :team_by_uuid, :only => [:create]
  before_filter :required_pipeline_update_params, :only => [:update]
  before_filter :required_pipeline_destroy_params, :only => [:destroy]
  before_filter :required_tier_creation_params, :only => [:add_tier]
  before_filter :required_tier_update_params, :only => [:update_tier]
  before_filter :required_tier_destroy_params, :only => [:destroy_tier]
  before_filter :pipeline_by_uuid, :only => [:update, :add_tier, :destroy]
  before_filter :tier_by_uuid, :only => [:update_tier, :destroy_tier]

  def index
    @current_team_user = TeamUser.find_by(user_id: @current_user.id, team_id: @pipeline.team.id)
    assert(@current_team_user)

    data = {
      name: @pipeline.name,
      description: @pipeline.description,
      pipeline_uuid: @pipeline.uuid,
      tiers: tiers_for_pipeline_view,
      show_prod_apps: @current_team_user.can_read_production_apps?,
      can_write_prod_apps: @current_team_user.can_write_production_apps?,
      write_access: @current_team_user.allow_pipeline_write_access?
    }

    configure_menu_data(@pipeline.team, selected_pipeline_slug: @pipeline.slug)
    configure_header_data

    render component: 'Pipeline', props: data
  end

  def create
    begin
      with_transaction do
        pipeline = PipelineServices::CreatePipeline.new(
          @current_user,
          @team,
          name: params[:name],
          description: params[:description]
        ).perform.pipeline

        track('New Pipeline', { team: @team.slug })

        render json: {
          url: pipeline.create_link
        }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::PipelineCreationFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update
    begin
      with_transaction do
        @pipeline.assign_attributes(allowed_update_params_for(:pipeline, params))

        response_data = {
          name: @pipeline.name,
          description: @pipeline.description
        }

        respond_with_new_url = @pipeline.name_changed?

        if @pipeline.name_changed?
          @pipeline.slug = nil
          @pipeline.generate_slug
        end

        @pipeline.save!

        response_data[:url] = @pipeline.create_link if respond_with_new_url

        render json: response_data

      end
    rescue Exception => e
      error = "#{ConfluxErrors::PipelineUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def destroy
    begin
      with_transaction do
        team = @pipeline.team

        @pipeline.destroy!

        apps_of_pipeline = App.unscoped
          .includes(:tier => :pipeline)
          .where(tiers: { pipeline_id: @pipeline.id })

        # Remove all keys from Redis mapping to each of these apps
        # AppServices::RemoveAppKeysFromRedis.new(
        #   @current_user,
        #   apps_of_pipeline
        # ).delay.perform

        track('Delete Pipeline', { team: team.slug })

        render json: { url: "/#{team.slug}" }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::PipelineDestroyFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  # Add a new tier other than the defaults
  def add_tier
    begin
      with_transaction do
        Tier.create!(
          name: params[:name],
          stage: params[:stage],
          pipeline_id: @pipeline.id
        )

        render json: tiers_for_pipeline_view
      end
    rescue Exception => e
      error = "#{ConfluxErrors::TierCreationFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update_tier
    begin
      with_transaction do
        @tier.update_attributes(allowed_update_params_for(:tier, params))

        render status: 200
      end
    rescue Exception => e
      error = "#{ConfluxErrors::TierUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def destroy_tier
    begin
      with_transaction do
        @pipeline = @tier.pipeline

        @tier.destroy!

        render json: tiers_for_pipeline_view
      end
    rescue Exception => e
      error = "#{ConfluxErrors::TierDestroyFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def name_available
    pipeline = params[:pipeline_uuid].present? ? Pipeline.find_by(uuid: params[:pipeline_uuid]) : nil

    available = is_name_available(Pipeline, params[:name], pipeline)

    render json: { available: available }
  end

end