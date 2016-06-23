class TeamsApiController < ApplicationController

  before_filter :current_api_user, :only => [:users]

  def users
    team = @current_user.teams.find_by(slug: params[:team_slug])

    assert(team)

    query = team.team_users.includes(:user)

    strip_data = lambda { |is_owner|
      query.where(is_owner: is_owner).order('users.email').map { |team_user|
        user = team_user.user

        {
          'email' => is_owner ? "#{user.email} (owner)" : user.email,
          'name' => user.name || ''
        }
      }
    }

    users = strip_data.call(true) + strip_data.call(false)

    render json: users
  end


end