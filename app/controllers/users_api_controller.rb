class UsersApiController < ApplicationController

  before_filter :current_api_user, :only => [:apps, :teams]

  def login
    user = User.find_by(
      email: params[:email],
      password: params[:password]
    )

    assert(user)

    user_token = UserToken.new(
      user_id: user.id,
      token: UUIDTools::UUID.random_create.to_s
    )

    user_token.save!

    render json: { user_token: user_token.token }
  end

  # Get all apps for a user, grouped by team
  def apps
    render json: @user.apps_by_team
  end

  # Same as `apps` above, but auth is just email/password
  def apps_basic_auth
    @user = User.find_by(
      email: params[:email],
      password: params[:password]
    )

    assert(@user)

    user_token = UserToken.new(
      user_id: @user.id,
      token: UUIDTools::UUID.random_create.to_s
    )

    user_token.save!

    render json: {
      apps_map: @user.apps_by_team,
      token: user_token.token
    }
  end

  def teams
    teams = @user.teams.order(:slug).map { |team|
      {
        'slug' => team.slug,
        'name' => team.name
      }
    }

    render json: teams
  end

end