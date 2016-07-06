class AppsApiController < ApplicationController

  before_filter :current_api_user, :only => [:manifest, :team_user_app_tokens]
  before_filter :validate_api_tokens, :only => [:pull]
  before_filter :set_app_conditional, :only => [:cost, :configs]

  def manifest
    app = @current_user.app(params[:app_slug])
    assert(app)

    pipeline = app.tier.pipeline
    team = pipeline.team

    team_user = TeamUser.find_by(user_id: @current_user.id, team_id: team.id)

    assert(team_user)

    team_user_token = TeamUserToken.new(
      team_user_id: team_user.id,
      token: UUIDTools::UUID.random_create.to_s
    )

    team_user_token.save!

    manifest = {
      'app' => {
        'name' => app.slug,
        'url' => "#{platform_url}/#{team.slug}/#{pipeline.slug}/#{app.slug}"
      },
      'configs' => {
        'CONFLUX_USER' => team_user_token.token,
        'CONFLUX_APP' => app.token
      }
    }

    EventService.new(
      @current_user,
      'CLI - New Conflux App Connection',
      props: { app: app.slug }
    ).delay.perform

    render json: { manifest: manifest, latest_gem_version: ENV['LATEST_RUBY_GEM_VERSION'] }
  end

  def pull
    configs = ApiServices::FetchConfigsService.new(nil, @app, @app_token).perform.configs

    past_jobs = params[:past_jobs].blank? ? [] : params[:past_jobs].split(',')

    jobs = ApiServices::FetchJobsService.new(nil, @app, @app_token, past_jobs).perform.jobs

    render json: { configs: configs, jobs: jobs }
  end

  def cost
    cost = @app.est_monthly_cost

    EventService.new(
      @current_user,
      'CLI - Checking Cost',
      props: { app: @app.slug }
    ).delay.perform

    render json: {
      app_slug: @app.slug,
      cost: (cost.to_i == 0) ? 'Free .99' : "$#{'%.2f' % cost}"
    }
  end

  def configs
    configs = ApiServices::FetchConfigsService.new(nil, @app, @app.token).perform.configs

    EventService.new(
      @current_user,
      'CLI - Checking Configs',
      props: { app: @app.slug }
    ).delay.perform

    render json: configs
  end

  def team_user_app_tokens
    app = @current_user.app(params[:app_slug])
    assert(app)

    pipeline = app.tier.pipeline
    team = pipeline.team

    team_user = TeamUser.find_by(user_id: @current_user.id, team_id: team.id)

    assert(team_user)

    team_user_token = TeamUserToken.new(
      team_user_id: team_user.id,
      token: UUIDTools::UUID.random_create.to_s
    )

    team_user_token.save!

    EventService.new(
      @current_user,
      'CLI - New Conflux-Heroku Connection',
      props: { app: app.slug }
    ).delay.perform

    render json: {
      'CONFLUX_USER' => team_user_token.token,
      'CONFLUX_APP' => app.token
    }
  end

end