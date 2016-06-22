class TeamUsersController < ApplicationController

  before_filter :set_current_user
  before_filter :team_by_uuid, :only => [:invite]
  before_filter :set_current_team_user => [:invite]
  before_filter :team_user_by_uuid, :only => [:destroy]

  def invite
    assert(params[:role])

    begin
      with_transaction do
        TeamUserServices::InviteUser.new(
          @current_user,
          params[:emails],
          @team,
          params[:role]
        ).perform
      end

      render json: { users: @team.formatted_team_users(@current_team_user) }
    rescue Exception => e
      error = "#{ConfluxErrors::UserInvitesFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def destroy
    team = @team_user.team

    current_team_user = TeamUser.find_by(user_id: @current_user.id, team_id: team.id)

    if current_team_user.nil?
      raise 'Error: You must be a part of the team your are removing a member for.'
    end

    if !current_team_user.at_least_admin
      raise 'You must be an admin for this team in order to remove a member.'
    end

    begin
      with_transaction do
        @team_user.destroy!
      end

      render json: { users: team.formatted_team_users(current_team_user) }
    rescue => e
      puts "Error destroying Team User #{@team_user.uuid} of Team #{team.name} with error: #{e.message}"
    end
  end

end