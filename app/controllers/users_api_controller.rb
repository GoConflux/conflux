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

    EventService.new(@current_user, 'CLI - User Login').delay.perform

    render json: { user_token: user_token.token }
  end

  # Get all apps for a user, grouped by team
  def apps
    EventService.new(@current_user, 'CLI - Apps for User').delay.perform
    render json: @current_user.apps_by_team
  end

  # Same as `apps` above, but auth is just email/password
  def apps_basic_auth
    @current_user = User.find_by(
      email: params[:email],
      password: params[:password]
    )

    assert(@current_user)

    user_token = UserToken.new(
      user_id: @current_user.id,
      token: UUIDTools::UUID.random_create.to_s
    )

    user_token.save!

    render json: {
      apps_map: @current_user.apps_by_team,
      token: user_token.token
    }
  end

  def teams
    teams = @current_user.teams.order(:slug).map { |team|
      {
        'slug' => team.slug,
        'name' => team.name
      }
    }

    EventService.new(@current_user, 'CLI - Teams for User').delay.perform

    render json: teams
  end

end