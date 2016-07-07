class TeamUsersApiController < ApplicationController

  before_filter :current_api_user, :only => [:invite]

  def invite
    team = Team.find_by(slug: params[:team_slug])
    assert(team)

    current_team_user = TeamUser.find_by(user_id: @current_user.id, team_id: team.id)
    assert(current_team_user)

    if !current_team_user.can_invite_team_user?
      show_invalid_permissions
      return
    end

    begin
      with_transaction do
        TeamUserServices::InviteUser.new(
          @current_user,
          [ params[:email] ],
          team,
          Role::CONTRIBUTOR_LIMITED
        ).perform
      end

      track('CLI - New User Invite', { invited: params[:email] })

      render json: {}, status: 200
    rescue Exception => e
      error = "#{ConfluxErrors::UserInvitesFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

end