module Heroku
  require 'platform-api'

  def self.heroku
    @heroku ||= PlatformAPI.connect_oauth(ENV['HEROKU_API_TOKEN'])
  end

  def self.create_heroku_app_for(app_scope)
    app_name = create_app_name
    heroku.app.create(name: app_name)
    app_scope.update_attributes(heroku_app: app_name)
  end

  # 'plan' is in format 'addon_slug:plan_slug'
  def self.create_addon(app_addon, plan)
    app_scope = app_addon.app_scope
    addon = app_addon.addon

    create_heroku_app_for(app_scope) if app_scope.heroku_app.nil?

    if addon.prevent_deprovision && AppAddon.unscoped.where(app_scope_id: app_scope.id, addon_id: addon.id).count > 1
      # If we're preventing the deprovision of this Addon (aka. keeping it active on the Heroku app side even if the
      # user removes it on the Conflux side) AND there's more than one existing Conflux AppAddon (unscoped) for this Addon,
      # than we know the addon was already provisioned before on the Heroku app. Therefore, don't create a new one.
      # *Will have to readdress this when plans can actually be chosen.
    else
      heroku.addon.create(app_scope.heroku_app, { plan: plan })
    end

    upsert_keys_from_new_config_vars(app_addon)
  end

  def self.upsert_keys_from_new_config_vars(app_addon)
    all_app_configs = heroku.config_var.info(app_addon.app_scope.heroku_app)

    addon_specific_configs = app_addon.addon.config_keys

    new_configs_map = all_app_configs.select { |key|
      addon_specific_configs.include?(key.to_s)
    }

    new_configs_map.each { |key, value|
      key = Key.find_or_initialize_by(
        app_addon_id: app_addon.id,
        name: key
      )

      key.assign_attributes(value: value)

      key.save!
    }
  end

  def self.create_app_name
    "conflux-#{SecureRandom.hex(3)}"
  end

  def self.remove_addon(app_addon)
    app_scope = app_addon.app_scope
    addon = app_addon.addon

    if app_scope.heroku_app.present?
      begin
        heroku.addon.delete(app_scope.heroku_app, addon.heroku_slug)
      rescue
        puts "Failed to remove heroku addon #{addon.heroku_slug} from app_scope with ID: #{app_scope.id}"
      end
    end
  end

  # 'plan' is in format 'addon_slug:plan_slug'
  def self.update_plan(app_addon, plan)
    app_scope = app_addon.app_scope
    addon = app_addon.addon

    if app_scope.heroku_app.present?
      heroku.addon.update(app_scope.heroku_app, addon.heroku_slug, { plan: plan })
    end
  end

end