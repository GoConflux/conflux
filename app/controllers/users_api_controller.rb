class UsersApiController < ApplicationController
  include TeamsHelper

  before_filter :current_api_user, :only => [:apps, :teams]

  def login
    email = params[:email]

    user = User.find_by(
      email: email,
      password: params[:password]
    )

    assert(user)

    user_token = UserToken.new(
      user_id: user.id,
      token: UUIDTools::UUID.random_create.to_s
    )

    user_token.save!

    track('CLI - User Login', { email: email })

    render json: { user_token: user_token.token }
  end

  def join
    email = params[:email]

    user = User.find_or_initialize_by(email: email) { |new_user|
      new_user.password = params[:password]
    }

    # If user already exists for this email, say so.
    if user.persisted?
      render json: { error: 'EmailTaken' }
      return
    end

    begin
      with_transaction do
        user.save! # Save new user

        # Create new UserToken for new user
        user_token = UserToken.new(
          user_id: user.id,
          token: UUIDTools::UUID.random_create.to_s
        )

        user_token.save!

        # Track new user join with Mixpanel
        track('CLI - New User', { email: email })

        new_team_name = random_team_name(email)

        # Create new Team/Pipeline/Tiers/App for new user based on his/her email
        new_team_svc = TeamServices::CreateTeam.new(
          user,
          { name: new_team_name },
        ).perform

        new_bundle = new_team_svc.new_bundle

        # Return the user's netrc-storable password as well as
        # the name of the auto-generated Conflux bundle.
        render json: { user_token: user_token.token, bundle: new_bundle.slug }
      end
    rescue Exception => e
      logger.error { "Error Joining New User with error: #{e.message}" }
      render json: {}, status: 500
    end
  end

  # Get all apps for a user, grouped by team
  def apps
    track('CLI - Apps for User')
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

    track('CLI - Teams for User')

    render json: teams
  end

end