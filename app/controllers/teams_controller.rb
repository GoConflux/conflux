class TeamsController < ApplicationController

  before_filter :set_current_user
  before_filter :set_team, :only => [:index, :users]
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
      apps: @team.apps.order(:slug).map{ |app| { slug: app.slug, name: app.name } }
    }

    admins = []
    others = []

    @team.team_users.includes(:user).each { |team_user|
      user = team_user.user

      user_data = {
        email: user.email,
        name: user.name,
        pic: user.pic,
        is_owner: team_user.is_owner,
        is_admin: team_user.is_admin
      }

      placement = (team_user.is_owner || team_user.is_admin) ? admins : others
      placement << user_data
    }

    admins = admins.sort_by { |user| [user[:is_owner], user[:email].downcase] }
    others = others.sort_by { |user| user[:email].downcase }

    @team_user_data[:users] = admins + others

    configure_menu_data(@team, users_selected: true)
    configure_header_data(use_window_history: true)
    render component: 'TeamUsers', props: @team_user_data
  end

  def name_available
    available = is_name_available(Team, params[:name])
    render json: { available: available }
  end

end