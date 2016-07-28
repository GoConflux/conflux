class KeysApiController < ApplicationController

  before_filter :validate_api_tokens, :only => [:index]
  before_filter :ensure_top_level_token, :only => [:remove_keys_from_redis]

  def index
    configs = ApiServices::FetchConfigsService.new(nil, @app, @app_token, @current_team_user).perform.configs
    render json: configs
  end

  # Remove apps' keys from Redis so that the next time
  # someone fetches the deprecated keys, they can't get them from Redis...
  # they'll have to get them from Postgres. They will then be re-added to Redis
  def remove_keys_from_redis
    begin
      if $redis.present?
        $redis.hdel(Key::CONFIGS, *params[:tokens])
        $redis.hdel(Key::JOBS, *params[:tokens])
      end

      render json: {}, status: 200
    rescue => e
      render json: { message: "Error removing tokens from redis: #{e}" }, status: 500
    end
  end

end