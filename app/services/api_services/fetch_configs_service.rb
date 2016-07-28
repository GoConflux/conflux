module ApiServices
  class FetchConfigsService < AbstractService

    attr_reader :configs

    def initialize(executor_user, app, app_token, team_user)
      super(executor_user)
      @app = app
      @app_token = app_token
      @team_user = team_user
    end

    def perform
      # Redis is just confusing things now...gonna switch to always pinging db until further redis schema is optimized to
      # support multiple users' keys
      # shared_configs = $redis.hget(Key::CONFIGS, @app_token) if $redis.present?
      # add_to_redis = false
      #
      # if shared_configs.present?
      #   shared_configs = JSON.parse(shared_configs) rescue {}
      #   personal_configs = @app.keys_from_pg(@team_user, personal_only: true)
      # else
      #   shared_configs, personal_configs = @app.keys_from_pg(@team_user)
      #   add_to_redis = true if $redis.present?
      # end
      #
      # $redis.hset(Key::CONFIGS, @app_token, shared_configs.to_json) if add_to_redis && $redis.present?

      @configs = @app.keys_from_pg(@team_user.id)

      self
    end
  end
end
