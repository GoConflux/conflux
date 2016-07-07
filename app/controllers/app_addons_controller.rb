class AppAddonsController < ApplicationController
  before_filter :set_current_user
  before_filter :set_app_addon, :only => [:index]
  before_filter :protect_app_addon, :only => [:index]
  before_filter :required_app_addon_creation_params, :only => [:create]
  before_filter :required_app_addon_update_params, :only => [:update]
  before_filter :required_app_addon_destroy_params, :only => [:destroy]
  before_filter :addon_by_uuid, :only => [:create]
  before_filter :app_by_uuid, :only => [:create]
  before_filter :app_addon_by_uuid, :only => [:update, :update_plan, :update_description, :destroy, :revoke_keys]

  def index
    addon = @app_addon.addon

    data = {
      name: addon.name,
      icon: addon.icon,
      description: @app_addon.description || addon.tagline,
      keys: @app_addon.keys_for_app_addon_view,
      app_uuid: @app_addon.app.uuid,
      addon_uuid: addon.uuid,
      app_addon_uuid: @app_addon.uuid,
      plan_data: {
        selected: addon.index_for_plan(@app_addon.plan),
        plans: addon.plans
      },
      links: [],
      write_access: @current_team_user.can_edit_addon?(@app_addon)
    }

    pipeline = @app_addon.app.tier.pipeline

    configure_menu_data(pipeline.team, selected_pipeline_slug: pipeline.slug)
    configure_header_data(app_addon: @app_addon)

    render component: 'AppAddon', props: data
  end

  def create
    current_addon_ids_for_app = @app.app_addons.includes(:addon).map { |app_addon| app_addon.addon.id }

    # If App already has an instance of the Addon, respond with a message explaining that you can't do that.
    if current_addon_ids_for_app.include?(@addon.id)
      render json: { addon_already_exists: true } and return
    end

    begin
      with_transaction do
        app_addon = AppAddon.create!(
          app_id: @app.id,
          addon_id: @addon.id,
          plan: params[:plan]
        )

        plan = params[:plan].present? ? "#{@addon.slug}:#{params[:plan]}" : @addon.basic_plan

        AppServices::ProvisionAppAddon.new(
          @current_user,
          app_addon,
          @addon.basic_plan # hardcoding basic plan until Stripe integration is added
        ).delay.perform

        # Remove all keys from Redis mapping to each of these apps
        AppServices::RemoveAppKeysFromRedis.new(
          @current_user,
          @app
        ).delay.perform

        track('New Add-on', { addon: @addon.slug })

        render json: {
          monthly_cost: "$#{'%.2f' % @app.est_monthly_cost}",
          addons: @app.addons_for_app_view
        }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonCreationFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update
    begin
      with_transaction do
        @app_addon.update_attributes(allowed_update_params_for(:app_addon, params))

        if params[:keys].present?
          @app_addon.update_keys(params[:keys])

          # Remove all keys from Redis mapping to each of these apps
          AppServices::RemoveAppKeysFromRedis.new(
            @current_user,
            @app_addon.app
          ).delay.perform
        end

        updated_data = {
          description: @app_addon.description || @app_addon.addon.tagline,
          keys: @app_addon.keys_for_app_addon_view
        }

        render json: updated_data
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update_plan
    begin
      with_transaction do
        @app_addon.update_attributes(plan: params[:plan])

        addon = @app_addon.addon

        # Also keeping commented out until Stripe integration is added
        # AppServices::ChangeAddonPlan.new(
        #   @current_user,
        #   @app_addon,
        #   "#{addon.slug}:#{params[:plan]}"
        # ).delay.perform

        track('Update Add-on Plan', { addon: addon.slug, plan: params[:plan] })

        render json: { selected: addon.index_for_plan(params[:plan]) }
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update_description
    begin
      with_transaction do
        @app_addon.update_attributes(description: params[:description])
        render json: {}
      end
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonUpdateFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def destroy
    begin
      app = @app_addon.app
      addon = @app_addon.addon

      @app_addon.destroy!

      AppServices::RemoveAppKeysFromRedis.new(
        @current_user,
        app
      ).perform

      track('Remove Add-on', { addon: addon.slug })

      render json: { url: app.create_link }
    rescue Exception => e
      error = "#{ConfluxErrors::AppAddonDestroyFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def revoke_keys
    begin
      with_transaction do
        KeyServices::RevokeKeys.new(
          @current_user,
          @app_addon
        ).delay.perform
      end
    rescue Exception => e
      error = "Error Revoking Keys for AppAddon with ID #{@app_addon.id}: #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

end