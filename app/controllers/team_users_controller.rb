class TeamUsersController < ApplicationController

  before_filter :set_current_user
  before_filter :team_by_uuid, :only => [:invite]

  def invite
    begin
      with_transaction do
        TeamUserServices::InviteUser.new(
          @current_user,
          emails: params[:emails],
          team: @team
        ).perform
      end

      render json: {}, status: 200
    rescue Exception => e
      error = "#{ConfluxErrors::UserInvitesFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

end