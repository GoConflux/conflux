class AppsApiController < ApplicationController

  before_filter :current_api_user, :only => [:manifest]
  before_filter :validate_api_tokens, :only => [:pull]
  before_filter :set_app_conditional, :only => [:cost, :configs]

  def manifest
    app = App.includes(:tier => [:pipeline => [:team]]).find_by(slug: params[:app_slug])

    assert(app)

    pipeline = app.tier.pipeline
    team = pipeline.team

    team_user = TeamUser.find_by(user_id: @user.id, team_id: team.id)

    assert(team_user)

    team_user_token = TeamUserToken.new(
      team_user_id: team_user.id,
      token: UUIDTools::UUID.random_create.to_s
    )

    team_user_token.save!

    render json: {
      'app' => {
        'name' => app.slug,
        'url' => "#{platform_url}/#{team.slug}/#{pipeline.slug}/#{app.slug}"
      },
      'configs' => {
        'CONFLUX_USER' => team_user_token.token,
        'CONFLUX_APP' => app.token
      }
    }
  end

  def pull
    configs = ApiServices::FetchConfigsService.new(nil, @app, @app_token).perform.configs

    past_jobs = params[:past_jobs].nil? ? [] : params[:past_jobs].split(',')

    jobs = ApiServices::FetchJobsService.new(nil, @app, @app_token, past_jobs).perform.jobs

    render json: { configs: configs, jobs: jobs }
  end

  def cost
    cost = @app.est_monthly_cost

    render json: {
      app_slug: @app.slug,
      cost: (cost.to_i == 0) ? 'Free .99' : "$#{'%.2f' % cost}"
    }
  end

  def configs
    configs = ApiServices::FetchConfigsService.new(nil, @app, @app.token).perform.configs
    render json: configs
  end

end