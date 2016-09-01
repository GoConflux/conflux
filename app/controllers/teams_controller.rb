class TeamsController < ApplicationController
  include TeamUsersHelper

  before_filter :set_current_user
  before_filter :set_team, :only => [:index, :users]
  before_filter :set_current_team_user, :only => [:users]
  before_filter :required_team_creation_params, :only => [:create]
  before_filter :required_team_update_params, :only => [:update]
  before_filter :required_team_destroy_params, :only => [:destroy]
  before_filter :team_by_uuid, :only => [:update, :destroy]

  def index
    pipelines = @team.pipelines.order('LOWER(name)')

    if pipelines.present?
      redirect_to "/#{@team.slug}/#{pipelines.first.slug}"
    else
      @current_team_user = TeamUser.find_by(user_id: @current_user.id, team_id: @team.id)
      assert(@current_team_user)

      configure_menu_data(@team)
      configure_header_data

      data = {
        team_uuid: @team.uuid,
        can_add_new_pipelines: @current_team_user.allow_pipeline_write_access?
      }

      render component: 'NoPipelines', props: data
    end
  end

  def create
    begin
      with_transaction do
        team = TeamServices::CreateTeam.new(
          @current_user,
          params,
        ).perform.team

        track('Create Team', { team: team.slug })

        render json: { url: team.create_link }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::TeamCreationFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update
    begin
      with_transaction do
        @team.assign_attributes(allowed_update_params_for(:team, params))

        if @team.name_changed?
          @team.slug = nil
          @team.generate_slug
        end

        @team.save!

        render json: { url: @team.create_link }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::TeamUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def destroy
    begin
      with_transaction do
        # Destroy the team
        @team.destroy!

        apps_of_team = App.unscoped
          .includes(:tier => [:pipeline => :team])
          .where(pipelines: { team_id: @team.id })

        # Remove all keys from Redis mapping to each of these apps
        # AppServices::RemoveAppKeysFromRedis.new(
        #   @current_user,
        #   apps_of_team
        # ).delay.perform

        track('Delete Team', { team: @team.slug })

        render json: {}
      end
    rescue Exception => e
      error = "#{ConfluxErrors::TeamDestroyFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def users
    @team_user_data = {
      team_name: @team.name,
      team_uuid: @team.uuid,
      apps: @team.apps.order(:slug).map{ |app| { slug: app.slug, name: app.name } },
      users: formatted_team_users,
      cu_can_edit: @current_team_user.can_update_team_user?,
      cu_can_invite: @current_team_user.can_invite_team_user?
    }

    configure_menu_data(@team, users_selected: true)
    configure_header_data(use_window_history: true)

    render component: 'TeamUsers', props: @team_user_data
  end

  def name_available
    team = params[:team_uuid].present? ? Team.find_by(uuid: params[:team_uuid]) : nil

    available = is_name_available(Team, params[:name], team)

    render json: { available: available }
  end

end