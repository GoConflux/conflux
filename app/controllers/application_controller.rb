class ApplicationController < ActionController::Base
  include StatusCodes
  include ConfluxErrors
  include ApplicationHelper

  COOKIE_KEY = 'conflux-user'
  CONFLUX_APP_TOKEN = 'Conflux-App'
  TOP_LEVEL_CONFLUX_TOKEN_NAME = 'Conflux-Token'

  REQUIRED_PARAMS = {
    team: {
      create: [:name],
      update: [:team_uuid],
      destroy: [:team_uuid]
    },
    pipeline: {
      create: [:name, :team_uuid],
      update: [:pipeline_uuid],
      destroy: [:pipeline_uuid]
    },
    tier: {
      create: [:name, :stage, :pipeline_uuid],
      update: [:tier_uuid],
      destroy: [:tier_uuid]
    },
    app: {
      create: [:name, :tier_uuid],
      update: [:app_uuid],
      destroy: [:app_uuid]
    },
    app_addon: {
      create: [:app_uuid, :addon_uuid, :plan],
      update: [:app_addon_uuid],
      destroy: [:app_addon_uuid]
    },
    key: {
      create: [:name, :value, :app_addon_uuid],
      update: [:key_uuid],
      destroy: [:key_uuid]
    }
  }

  # ---------- Before Filters ----------

  def required_auth_credentials_exist
    required_creds = [
      :email,
      :password
    ]

    required_creds.each { |key|
      if params[key].nil?
        render json: { message: 'Auth credential requirement(s) missing' }, status: 500
        return
      end
    }
  end

  def check_for_current_user
    cookies[UserToken::HEADER].tap { |token|
      user_token = UserToken.find_by(token: token, expired: false)
      @current_user = user_token.user if user_token.present?
    }
  end

  def get_user_teams_for_header(home: false, explore: false, toolbelt: false, service: false)
    @header_team_data = {}
    @header_team_data[:home] = true if home
    @header_team_data[:explore] = true if explore
    @header_team_data[:toolbelt] = true if toolbelt
    @header_team_data[:service] = true if service

    if @current_user
      @header_team_data[:authed] = true
      @header_team_data[:teams] = @current_user.teams.order(:slug).map { |team|
        {
          name: team.name,
          icon: team.icon,
          url: team.create_link
        }
      }

      @header_team_data[:inside_app] = true if @header_data
    end
  end

  def set_current_user
    cookies[UserToken::HEADER].tap { |token|
      user_token = UserToken.find_by(token: token, expired: false)
      @current_user = user_token.user if user_token.present?

      if @current_user.nil?
        redirect_to controller: 'login', action: 'index'
      end
    }
  end

  def set_current_team_user
    @current_team_user = TeamUser.find_by(team_id: @team.id, user_id: @current_user.id)
    assert(@current_team_user)
  end

  def validate_api_tokens
    [UserToken::HEADER, CONFLUX_APP_TOKEN].each { |token|
      if request.headers[token].nil?
        show_invalid_permissions
        return
      end
    }

    team_user_token = TeamUserToken.find_by(
      token: request.headers[UserToken::HEADER],
      expired: false
    )

    if team_user_token.nil?
      render json: { message: 'Invalid TeamUserToken' }, status: 500
      return
    end

    @current_team_user = team_user_token.team_user

    if @current_team_user.nil?
      render json: { message: 'TeamUser not found for TeamUserToken' }, status: 500
      return
    end

    @current_user ||= @current_team_user.user

    @app_token = request.headers[CONFLUX_APP_TOKEN]

    @app = @current_team_user.team.apps.find_by(token: @app_token)

    if @app.nil?
      render json: { message: 'App not found' }, status: 500
    end
  end

  def ensure_top_level_token
    top_level_token = request.headers[TOP_LEVEL_CONFLUX_TOKEN_NAME]

    if top_level_token.nil? || top_level_token != ENV['TOP_LEVEL_CONFLUX_TOKEN']
      show_invalid_permissions
    end
  end

  def current_api_user
    token = request.headers[UserToken::HEADER]

    if token.nil?
      show_invalid_permissions
      return
    end

    UserToken.find_by(token: token).tap { |user_token|
      @current_user = user_token.try(:user)
      show_invalid_permissions if @current_user.nil?
    }
  end

  def set_app_conditional
    # if app_slug is provided, find the app with this slug for this user
    if params[:app_slug].present?
      current_api_user

      @app = @current_user.app(params[:app_slug])
      assert(@app, StatusCodes::AppNotFound)

    # otherwise, validate header tokens --> which also defines @app
    else
      validate_api_tokens
    end
  end

  def set_team
    @team = Team.includes(:pipelines).find_by(slug: params[:team_slug])

    page_dne if @team.nil?
  end

  def team_by_uuid
    @team = Team.find_by(uuid: params[:team_uuid])
    assert(@team, StatusCodes::TeamNotFound)
  end

  def set_pipeline
    @pipeline = Pipeline.includes(:team).where({
      slug: params[:pipeline_slug],
      teams: {
        slug: params[:team_slug]
      }
    }).take

    page_dne if @pipeline.nil?
  end

  def pipeline_by_uuid
    @pipeline = Pipeline.find_by(uuid: params[:pipeline_uuid])
    assert(@pipeline, StatusCodes::PipelineNotFound)
  end

  def tier_by_uuid
    @tier = Tier.find_by(uuid: params[:tier_uuid])
    assert(@tier, StatusCodes::TierNotFound)
  end

  def set_app
    @app = App.joins(tier: { pipeline: :team }).where({
      slug: params[:app_slug],
      pipelines: {
        slug: params[:pipeline_slug],
      },
      teams: {
        slug: params[:team_slug]
      }
    }).take

    page_dne if @app.nil?
  end

  def app_by_uuid
    @app = App.find_by(uuid: params[:app_uuid])
    assert(@app, StatusCodes::AppNotFound)
  end

  def set_app_addon
    addon_slug = params[:addon_slug]
    scope = addon_slug.match(/-personal/).present? ? AppScope::PERSONAL : AppScope::SHARED
    addon_slug = addon_slug.gsub('-personal', '')

    @app_addon = AppAddon.includes(:addon).joins(app_scope: { app: { tier: { pipeline: :team } } }).where({
      app_scopes: {
        scope: scope
      },
      addons: {
        slug: addon_slug
      },
      apps: {
        slug: params[:app_slug],
      },
      pipelines: {
        slug: params[:pipeline_slug],
      },
      teams: {
        slug: params[:team_slug]
      }
    }).take

    page_dne if @app_addon.nil?
  end

  def set_addon
    @addon = Addon.find_by(slug: params[:addon_slug])
    assert(@addon, StatusCodes::AddonNotFound)
  end

  def addon_by_uuid
    @addon = Addon.find_by(uuid: params[:addon_uuid])
    assert(@addon, StatusCodes::AddonNotFound)
  end

  def app_addon_by_uuid
    @app_addon = AppAddon.find_by(uuid: params[:app_addon_uuid])
    assert(@app_addon, StatusCodes::AppAddonNotFound)
  end

  def key_by_uuid
    @key = Key.find_by(uuid: params[:key_uuid])
    assert(@key, StatusCodes::KeyNotFound)
  end

  def team_user_by_uuid
    @team_user = TeamUser.find_by(uuid: params[:team_user_uuid])
    assert(@team_user, StatusCodes::ResourceNotFound)
  end

  def user_by_uuid
    @user = User.find_by(uuid: params[:user_uuid])
    assert(@user, StatusCodes::ResourceNotFound)
  end

  def protect_app(check_for_write_perms = false)
    @current_team_user ||= TeamUser.find_by(user_id: @current_user.id, team_id: @app.tier.pipeline.team.id)
    assert(@current_team_user)

    perm_check = check_for_write_perms ?
      @current_team_user.can_write_production_apps? : @current_team_user.can_read_production_apps?

    if @app.tier.is_prod? && !perm_check
      show_invalid_permissions
    end
  end

  def protect_app_addon
    @current_team_user ||= TeamUser.find_by(user_id: @current_user.id, team_id: @app_addon.app_scope.app.tier.pipeline.team.id)
    assert(@current_team_user)

    if @app_addon.app_scope.app.tier.is_prod? && !@current_team_user.can_read_production_apps?
      show_invalid_permissions
    end
  end

  def show_invalid_permissions
    render json: { message: 'Invalid Permissions' }, status: 403
  end

  def unscoped_addon_by_slug
    @addon = Addon.unscoped.find_by(slug: params[:addon_slug], is_destroyed: false)
    page_dne if @addon.nil?
  end

  # Make sure @addon has been set before calling this.
  def current_addon_admin
    @current_addon_admin = @current_user.present? ? @addon.addon_admins.find_by(user_id: @current_user.id) : nil
  end

  # ---------- Helpers ----------

  def required_params(required_keys)
    required_keys.each { |key|
      assert(params[key], StatusCodes::RequiredParamsMissing) or return
    }
  end

  def required_team_creation_params
    required_params(REQUIRED_PARAMS[:team][:create])
  end

  def required_team_update_params
    required_params(REQUIRED_PARAMS[:team][:update])
  end

  def required_team_destroy_params
    required_params(REQUIRED_PARAMS[:team][:destroy])
  end

  def required_pipeline_creation_params
    required_params(REQUIRED_PARAMS[:pipeline][:create])
  end

  def required_pipeline_update_params
    required_params(REQUIRED_PARAMS[:pipeline][:update])
  end

  def required_pipeline_destroy_params
    required_params(REQUIRED_PARAMS[:pipeline][:destroy])
  end

  def required_tier_creation_params
    required_params(REQUIRED_PARAMS[:tier][:create])
  end

  def required_tier_update_params
    required_params(REQUIRED_PARAMS[:tier][:update])
  end

  def required_tier_destroy_params
    required_params(REQUIRED_PARAMS[:tier][:destroy])
  end

  def required_app_creation_params
    required_params(REQUIRED_PARAMS[:app][:create])
  end

  def required_app_update_params
    required_params(REQUIRED_PARAMS[:app][:update])
  end

  def required_app_destroy_params
    required_params(REQUIRED_PARAMS[:app][:destroy])
  end

  def required_app_addon_creation_params
    required_params(REQUIRED_PARAMS[:app_addon][:create])
  end

  def required_app_addon_update_params
    required_params(REQUIRED_PARAMS[:app_addon][:update])
  end

  def required_app_addon_destroy_params
    required_params(REQUIRED_PARAMS[:app_addon][:destroy])
  end

  def required_key_creation_params
    required_params(REQUIRED_PARAMS[:key][:create])
  end

  def required_key_update_params
    required_params(REQUIRED_PARAMS[:key][:update])
  end

  def required_key_destroy_params
    required_params(REQUIRED_PARAMS[:key][:destroy])
  end

  def is_name_available(model, name, record = nil)
    # ensure name won't interfere with your routes
    return false if slug_blacklisted?(name.slugify)

    # Find a record that already exists for this slug
    existing_record = model.find_by(slug: name.slugify)

    # If no record is found, go ahead and return true (aka. it's available)
    return true if existing_record.nil?

    # If a record already exists, it's availability should be based
    # on whether the one found is the same as the one passed in as the "record" argument
    return existing_record.id == record.try(:id)
  end

  def assert(value, status_code = StatusCodes::UnknownError, message = nil, http_code = 400, format = :json)
    valid = value.present?

    if !valid
      raise AssertionException.new(
        status_code,
        message: message,
        http_code: http_code,
        format: format
      )
    end

    valid
  end

  def page_dne
    render component: 'PageDNE'
  end

  def configure_menu_data(
    team,
    selected_pipeline_slug: nil,
    users_selected: false,
    team_settings_selected: false
  )

    @current_team_user ||= TeamUser.find_by(user_id: @current_user.id, team_id: team.id)
    assert(@current_team_user)

    @show_menu = true

    @menu_data = {
      name: team.name,
      icon: team.icon,
      team_uuid: team.uuid,
      link: "/#{team.slug}",
      can_access_team_settings: @current_team_user.is_owner?,
      allow_new_pipelines: @current_team_user.allow_pipeline_write_access?,
      users_selected: users_selected,
      team_settings_selected: team_settings_selected,
      pipelines: (team.pipelines.order('LOWER(name)') || []).map { |p|
        {
          name: p.name,
          link: p.create_link,
          selected: p.slug == selected_pipeline_slug
        }
      }
    }
  end

  def configure_header_data(app: nil, app_addon: nil, use_window_history: false)
    model = app || app_addon
    back_data = model.try(:get_back_data) || {}

    @header_data = {
      back_url: use_window_history ? 'javascript:void(0)' : back_data[:url],
      back_text: use_window_history ? 'Back' : back_data[:text],
      use_window_history: use_window_history
    }

    get_user_teams_for_header
  end

  class AssertionException < Exception
    attr_accessor :status_code, :message, :http_code, :format, :data

    def initialize(status_code, message: nil, http_code: 400, format: :json, data: nil)
      @status_code = status_code
      @message     = message
      @http_code   = http_code
      @format      = format
      @data        = data
    end
  end

end
