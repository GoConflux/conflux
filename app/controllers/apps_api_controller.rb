class AppsApiController < ApplicationController
  include AppsHelper

  before_filter :current_api_user, :only => [:manifest, :team_user_app_tokens, :exists, :clone]
  before_filter :validate_api_tokens, :only => [:pull]
  before_filter :set_app_conditional, :only => [:cost, :configs]
  before_filter :app_by_uuid, :only => [:clone]

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

    track('CLI - New Conflux App Connection', { app: app.slug })

    render json: { manifest: manifest, latest_gem_version: ENV['LATEST_RUBY_GEM_VERSION'] }
  end

  def pull
    configs = ApiServices::FetchConfigsService.new(nil, @app, @app_token, @current_team_user).perform.configs

    past_jobs = params[:past_jobs].blank? ? [] : params[:past_jobs].split(',')

    jobs = ApiServices::FetchJobsService.new(nil, @app, @app_token, past_jobs, @current_team_user).perform.jobs

    render json: { configs: configs, jobs: jobs }
  end

  def cost
    cost = @app.est_monthly_cost

    track('CLI - Checking Cost', { app: @app.slug })

    render json: {
      app_slug: @app.slug,
      cost: (cost.to_i == 0) ? 'Free .99' : "$#{'%.2f' % cost}"
    }
  end

  def configs
    @current_team_user ||= TeamUser.find_by(team_id: @app.tier.pipeline.team.id, user_id: @current_user.id)
    assert(@current_team_user)

    configs = ApiServices::FetchConfigsService.new(nil, @app, @app.token, @current_team_user).perform.configs

    track('CLI - Checking Configs', { app: @app.slug })

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

    track('CLI - New Conflux-Heroku Connection', { app: app.slug })

    render json: {
      'CONFLUX_USER' => team_user_token.token,
      'CONFLUX_APP' => app.token
    }
  end

  def exists
    app = @current_user.app(params[:app_slug])
    render json: { 'exists' => app.present?, 'uuid' => app.try(:uuid) }
  end

  def clone
    app_tier = @app.tier

    if app_tier.stage == params[:tier_stage]
      tier = app_tier
    else
      tier = app_tier.pipeline.tiers.find_by(stage: params[:tier_stage])
    end

    assert(tier)

    begin
      with_transaction do
        new_app, shared_app_scope = create_new_app({
          name: params[:dest_app_name],
          token: UUIDTools::UUID.random_create.to_s,
          tier_id: tier.id
        })

        team_slug = app_tier.pipeline.team.slug

        track('Cloned Bundle', { team: team_slug })

        @app.addons.each { |addon|
          plan = addon.basic_plan

          app_addon = AppAddon.new(
            app_scope_id: shared_app_scope.id,
            addon_id: addon.id,
            plan: plan
          )

          app_addon.save!

          AppServices::ProvisionAppAddon.new(
            @current_user,
            app_addon,
            plan
          ).delay.perform
        }

        render json: {}, status: 200
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppCreationFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

end