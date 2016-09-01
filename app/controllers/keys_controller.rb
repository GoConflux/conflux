class KeysController < ApplicationController

  before_filter :set_current_user
  before_filter :required_key_creation_params, :only => [:create]
  before_filter :app_addon_by_uuid, :only => [:create]
  before_filter :required_key_update_params, :only => [:update]
  before_filter :required_key_destroy_params, :only => [:destroy]
  before_filter :key_by_uuid, :only => [:update, :destroy]

  def create
    begin
      with_transaction do
        Key.create!(
          name: params[:name],
          value: params[:value],
          description: params[:description],
          app_addon_id: @app_addon.id
        )

        # Remove all keys from Redis mapping to each of these apps
        # AppServices::RemoveAppKeysFromRedis.new(
        #   @current_user,
        #   @app_addon.app_scope.app
        # ).delay.perform

        track('New Key')

        render json: @app_addon.keys_for_app_addon_view
      end
    rescue Exception => e
      error = "#{ConfluxErrors::KeyCreationFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update
    begin
      with_transaction do
        @key.update_attributes(allowed_update_params_for(:key, params))

        # Remove all keys from Redis mapping to each of these apps
        # AppServices::RemoveAppKeysFromRedis.new(
        #   @current_user,
        #   @key.app_addon.app_scope.app
        # ).delay.perform

        render json: @key.app_addon.keys_for_app_addon_view
      end
    rescue Exception => e
      error = "#{ConfluxErrors::KeyUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def destroy
    begin
      with_transaction do
        app_addon = @key.app_addon

        @key.destroy!

        # Remove all keys from Redis mapping to each of these apps
        # AppServices::RemoveAppKeysFromRedis.new(
        #   @current_user,
        #   app_addon.app_scope.app
        # ).delay.perform

        render json: app_addon.keys_for_app_addon_view
      end
    rescue Exception => e
      error = "#{ConfluxErrors::KeyDestroyFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

end