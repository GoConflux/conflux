class TeamUsersController < ApplicationController

  before_filter :set_current_user
  before_filter :team_by_uuid
  before_filter :set_current_team_user

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

      render json: { users: @team.formatted_team_users(@current_team_user) }, status: 200
    rescue Exception => e
      error = "#{ConfluxErrors::UserInvitesFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

end