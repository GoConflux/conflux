class AppAddonsApiController < ApplicationController
  include AppsHelper

  before_filter :set_addon
  before_filter :set_app_conditional

  def create
    scope = params[:scope] || 0

    addons_for_scope = @app.app_addons
      .includes(:app_scope, :addon)
      .where(app_scopes: { scope: scope })
      .map { |app_addon| app_addon.addon.id }

    # Return if app_scope already has that addon
    if addons_for_scope.include?(@addon.id)
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
      $mixpanel.track(@current_user.email, 'Paid plan selected', { addon: @addon.name, plan: plan }) if $mixpanel.present?
      render json: { plan_disabled: true }
      return
    end

    protect_app(true)

    case scope
      when AppScope::SHARED
        app_scope = @app.shared_app_scope
      when AppScope::PERSONAL
        app_scope = personal_app_scope  # find_or_create_by
    end

    assert(app_scope)

    begin
      with_transaction do
        app_addon = AppAddon.create!(
          app_scope_id: app_scope.id,
          addon_id: @addon.id,
          plan: plan
        )

        AppServices::ProvisionAppAddon.new(
          @current_user,
          app_addon,
          plan
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
    protect_app(true)

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