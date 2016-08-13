module ApplicationHelper
  require 'utils/env'
  require 'twitter_oauth'

  ALLOWED_CREATION_PARAMS = {
    team: [:name]
  }

  ALLOWED_UPDATE_PARAMS = {
    team: [:name, :icon],
    pipeline: [:name, :description],
    tier: [:name, :stage],
    app: [:name, :description, :tier_id],
    app_addon: [:description],
    key: [:name, :value, :description]
  }

  SLUGS_BLACKLIST = [
    '--me',
    'clone_info',
    'twitter_oauth',
    'twitter_sign_in',
    'downloads',
    'conflux-installer.pkg',
    'conflux-installer.exe',
    '.well-known',
    'acme-challenge',
    'fonts',
    'services',
    'download',
    'api',
    'login',
    'signup',
    'signout',
    'reset_password',
    'search',
    'modal_info',
    'for_app',
    'all',
    'plan',
    'plans',
    'jobs',
    'job',
    'name_available',
    'manifest',
    'team_user_app_tokens',
    'cost',
    'config',
    'configs',
    'pull',
    'key',
    'keys',
    'addon',
    'addons',
    'app-addon',
    'app-addons',
    'app_addon',
    'app_addons',
    'app',
    'apps',
    'tier',
    'tiers',
    'pipeline',
    'pipelines',
    'team',
    'teams',
    'team_user',
    'team_users',
    'team-user',
    'team-users',
    'user',
    'users',
    'heroku-postgresql',
    'heroku-redis',
    'mongolab',
    'redistogo',
    'blitline',
    'pandastream',
    'bomberman',
    'suggestgrid',
    'stream',
    'iron_worker',
    'pubnub',
    'proximo',
    'sendgrid',
    'websolr',
    'bucketeer'
  ]

  def with_transaction(&block)
    raise 'no block given' unless block_given?

    begin
      ActiveRecord::Base.transaction do
        block.call
      end
    rescue Exception => e
      raise e
    end
  end

  def allowed_creation_params_for(model, params)
    allowed_params_for(ALLOWED_CREATION_PARAMS, model, params)
  end

  def allowed_update_params_for(model, params)
    allowed_params_for(ALLOWED_UPDATE_PARAMS, model, params)
  end

  def allowed_params_for(map, model, params)
    allowed_provided_keys = {}

    (map[model] || []).each { |key|
      allowed_provided_keys[key] = params[key]
    }

    allowed_provided_keys.compact
  end

  def generate_temp_password
    SecureRandom.hex(3)
  end

  def platform_url
    ENV['CONFLUX_PLATFORM_URL'] || 'https://www.goconflux.com'
  end

  def app_for_user(user)
    App.includes(:tier => [:pipeline => [:team => :team_users]])
      .find_by(
        slug: params[:app_slug],
        team_users: {
          user_id: user.id
        }
      )
  end

  def slug_blacklisted?(slug)
    SLUGS_BLACKLIST.include?(slug)
  end

  def should_track_events
    Utils::Env.is_enabled?('TRACK_EVENTS') && Rails.env.production? && !@current_user.try(:is_conflux_admin?)
  end

  def track(event, props = {})
    EventService.new(@current_user, event, props).delay.perform if should_track_events
  end

  def twitter_client
    TwitterOAuth::Client.new(
      consumer_key: ENV['TWITTER_CONSUMER_KEY'],
      consumer_secret: ENV['TWITTER_CONSUMER_SECRET']
    )
  end

end