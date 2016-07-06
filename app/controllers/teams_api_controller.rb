class TeamsApiController < ApplicationController
  include TeamUsersHelper

  before_filter :current_api_user, :only => [:users]

  def users
    @team = @current_user.teams.find_by(slug: params[:team_slug])
    assert(@team)

    @current_team_user = TeamUser.find_by(user_id: @current_user.id, team_id: @team.id)

    team_users = formatted_team_users.map { |user_info|
      {
        'email' => user_info[:email],
        'name' => user_info[:name] || '',
        'role' => string_role_for_int_role(user_info[:role])
      }
    }

    EventService.new(
      @current_user,
      'CLI - Fetch Users for Team',
      props: { team: @team.slug }
    ).delay.perform

    render json: team_users
  end

end