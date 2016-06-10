module ApplicationHelper

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
    ENV['CONFLUX_PLATFORM_URL'] || 'http://www.goconflux.com'
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

end
