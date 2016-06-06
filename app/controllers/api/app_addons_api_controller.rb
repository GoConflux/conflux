class AppAddonsApiController < ApplicationController

  before_filter :set_app_conditional, :only => [:create]

  def create
    addon = Addon.find_by(slug: params[:addon_slug])
    assert(addon)

    current_addon_ids_for_app = @app.app_addons.includes(:addon).map { |app_addon| app_addon.addon.id }

    # If App already has an instance of the Addon, respond with a message explaining that you can't do that.
    if current_addon_ids_for_app.include?(addon.id)
      render json: { addon_already_exists: true }
      return
    end

    plan = addon.basic_plan_slug if params[:plan].nil? || !addon.has_plan?(params[:plan])

    begin
      with_transaction do
        app_addon = AppAddon.create!(
          app_id: @app.id,
          addon_id: addon.id,
          plan: plan
        )

        AppServices::ProvisionAppAddon.new(
          @user,
          app_addon,
          addon.basic_plan # hardcoding basic plan until Stripe integration is added
        ).perform

        $redis.hdel(Key::CONFIGS, @app.token)

        render json: { app_slug: @app.slug }
      end
    rescue Exception => e
      logger.error { e.message }
      render json: { message: "Error adding app_addon #{e.message}" }, status: 500
    end
  end

end