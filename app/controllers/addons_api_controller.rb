class AddonsApiController < ApplicationController

  before_filter :set_app_conditional, :only => [:for_app]
  before_filter :current_api_user, :only => [:push]

  def for_app
    @current_team_user = TeamUser.find_by(team_id: @app.tier.pipeline.team.id, user_id: @current_user.id)
    assert(@current_team_user)

    addons = @app.app_addons
      .includes(:app_scope, :addon)
      .where(app_scopes: { team_user_id: [nil, @current_team_user.id] })
      .map { |app_addon|
        addon = app_addon.addon
        plan = app_addon.plan

        {
          'slug' => addon.slug,
          'name' => addon.name,
          'scope' => app_addon.app_scope.scope == AppScope::PERSONAL ? 'Personal' : 'Shared',
          'plan' => plan,
          'cost' => addon.cost_for_plan(plan)
        }
      }.sort_by { |a| [a['scope'], a['slug']] }

    track('CLI - Fetch Add-ons for App', { app: @app.slug })

    render json: addons, status: 200
  end

  def all
    addons = Addon.all.order(:slug).map { |addon|
      {
        'slug' => addon.slug,
        'name' => addon.name,
        'description' => addon.tagline
      }
    }

    track('CLI - Fetch All Add-ons')

    render json: addons, status: 200
  end

  def plans
    addon = Addon.find_by(slug: params[:addon_slug])
    assert(addon)

    track('CLI - Fetch Plans for Add-on', { addon: addon.slug })

    render json: addon.formatted_plans
  end

  def push
    begin
      manifest = params[:manifest]
      manifest_test = ManifestTest.new(manifest)

      # Make sure manifest is valid.
      raise "Invalid Manifest: #{manifest_test.err_message}" unless manifest_test.call

      # Find or initialize an addon by the slug from the manifest
      addon = Addon.unscoped.find_or_initialize_by(slug: manifest['id'], is_destroyed: false)
      current_addon_admin = nil

      # If the addon already existed...
      if addon.persisted?
        # Check to see if the current_user is an addon_admin. If not, raise a permissions error.
        current_addon_admin = AddonAdmin.find_by(user_id: @current_user.id, addon_id: addon.id)

        if current_addon_admin.nil?
          raise 'id for service is unavailable. Change the "id" field in your Conflux manifest and then try again.'
        end
      end

      api = manifest['api'] || {}

      # Ex: ["MY_CONFIG", ...] --> [{ name: "MY_CONFIG", description: "" }, ...]
      # Owner can update the descriptions from the UI later.
      configs = (api['config_vars'] || []).map { |key|
        {
          name: key,
          description: ''
        }
      }

      with_transaction do
        attrs_to_update = {
          slug: manifest['id'],
          configs: configs,
          api: {
            production: api['production'],
            test: api['test']
          }
        }

        # if addon is new, add the password, sso_salt, and status attributes.
        if !addon.persisted?
          attrs_to_update.merge!({
            password: api['password'],
            sso_salt: api['sso_salt'],
            status: Addon::Status::DRAFT
          })
        end

        addon.assign_attributes(attrs_to_update)
        addon.save!

        # if this is nil, that means the addon is new. So create the addon_admin now.
        if current_addon_admin.nil?
          current_addon_admin = AddonAdmin.find_or_initialize_by(user_id: @current_user.id, addon_id: addon.id) { |aa|
            aa.is_owner = true
          }

          current_addon_admin.save!
        end
      end

      render json: {}, status: 200
    rescue Exception => e
      render json: { message: e.message }, status: 500
    end
  end

end