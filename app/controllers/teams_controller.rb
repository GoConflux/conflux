class TeamsController < ApplicationController

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
      configure_menu_data(@team)
      configure_header_data
      render component: 'NoPipelines', props: { team_uuid: @team.uuid }
    end
  end

  def create
    begin
      with_transaction do
        team = TeamServices::CreateTeam.new(
          @current_user,
          params,
        ).perform.team

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
        @team.update_attributes(allowed_update_params_for(:team, params))
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
        # Get all tokens for all apps belonging to this team
        apps = @team.apps

        # Destroy the team
        @team.destroy!

        # Remove all keys from Redis mapping to each of these apps
        AppServices::RemoveAppKeysFromRedis.new(
          @current_user,
          apps
        ).delay.perform

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
      users: @team.formatted_team_users(@current_team_user),
      cu_can_edit: @current_team_user.at_least_admin,
      cu_can_invite: @current_team_user.at_least_admin
    }

    configure_menu_data(@team, users_selected: true)
    configure_header_data(use_window_history: true)

    render component: 'TeamUsers', props: @team_user_data
  end

  def name_available
    available = is_name_available(Team, params[:name])
    render json: { available: available }
  end

end