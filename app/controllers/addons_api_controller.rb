require 'helpers/manifest_test'

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
      manifest_valid = Conflux::ManifestTest.new(manifest).call!

      # Make sure manifest is valid in structure
      raise 'Unknown Manifest Error' unless manifest_valid

      # Make sure slug is available
      raise 'Slug/ID is already taken' unless is_name_available(Addon, manifest['id'])

      api = manifest['api'] || {}

      # Create new draft Addon
      addon = Addon.create!(
        slug: manifest['id'],
        configs: api['config_vars'],
        password: api['password'],
        sso_salt: api['sso_salt'],
        api: {
          production: api['production'],
          test: api['production']
        },
        status: Addon::Status::DRAFT
      )

      # Create new AddonAdmin so that this addon has an owner
      AddonAdmin.create!(
        addon_id: addon.id,
        user_id: @current_user.id,
        is_owner: true
      )

      # Send back the url for the new draft service so that the owner can
      # go there and finish the submission process
      render json: { url: "#{ENV['CONFLUX_USER_ADDRESS']}/services/#{addon.slug}" }, status: 200
    rescue Exception => e
      render json: { message: "Invalid Manifest: #{e.message}" }, status: 500
    end
  end

end