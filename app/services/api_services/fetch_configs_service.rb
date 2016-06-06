module ApiServices
  class FetchConfigsService < AbstractService

    attr_reader :configs

    def initialize(executor_user, app, app_token)
      super(executor_user)
      @app = app
      @app_token = app_token
    end

    def perform
      @configs = $redis.hget(Key::CONFIGS, @app_token) if $redis.present?
      add_to_redis = false

      if @configs.present?
        @configs = JSON.parse(@configs) rescue {}
      else
        @configs = @app.keys_from_pg
        add_to_redis = true if $redis.present?
      end

      $redis.hset(Key::CONFIGS, @app_token, @configs.to_json) if add_to_redis && $redis.present?

      self
    end
  end
end
