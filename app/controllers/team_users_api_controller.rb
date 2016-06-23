class TeamUsersApiController < ApplicationController

  before_filter :current_api_user, :only => [:invite]

  def invite
    team = Team.find_by(slug: params[:team_slug])
    assert(team)

    begin
      with_transaction do
        TeamUserServices::InviteUser.new(
          @current_user,
          [ params[:email] ],
          team
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