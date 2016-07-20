class AppAddonsApiController < ApplicationController

  before_filter :set_addon
  before_filter :set_app_conditional
  before_filter :protect_app

  def create
    current_addon_ids_for_app = @app.app_addons.includes(:addon).map { |app_addon| app_addon.addon.id }

    # If App already has an instance of the Addon, respond with a message explaining that you can't do that.
    if current_addon_ids_for_app.include?(@addon.id)
      render json: { addon_already_exists: true }
      return
    end

    plan = params[:plan]

    # If no plan passed in or the plan passed in isn't actually valid, default to the basic plan.
    if plan.nil? || !@addon.has_plan?(plan)
      plan = @addon.basic_plan_slug
    end

    # If plan is disabled, say so.
    if @addon.plan_disabled?(plan)
      $mixpanel.track('Paid plan selected', { addon: @addon.name, plan: plan }) if $mixpanel.present?
      render json: { plan_disabled: true }
      return
    end

    begin
      with_transaction do
        app_addon = AppAddon.create!(
          app_id: @app.id,
          addon_id: @addon.id,
          plan: plan
        )

        AppServices::ProvisionAppAddon.new(
          @current_user,
          app_addon,
          @addon.basic_plan # hardcoding basic plan until Stripe integration is added
        ).perform

        if $redis.present?
          $redis.hdel(Key::CONFIGS, @app.token)
          $redis.hdel(Key::JOBS, @app.token)
        end

        track('CLI - New Add-on', { addon: @addon.slug })

        render json: { 'app_slug' => @app.slug }
      end
    rescue Exception => e
      logger.error { e.message }
      render json: { message: "Error adding app_addon #{e.message}" }, status: 500
    end
  end

  def destroy
    begin
      app_addon = @app.app_addons.find_by(addon_id: @addon.id)
      assert(app_addon)

      app_addon.destroy!

      if $redis.present?
        $redis.hdel(Key::CONFIGS, @app.token)
        $redis.hdel(Key::JOBS, @app.token)
      end

      track('CLI - Remove Add-on', { addon: @addon.slug })

      render json: { 'app_slug' => @app.slug }
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonDestroyFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

end