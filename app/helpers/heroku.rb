module Heroku
  require 'platform-api'

  def self.heroku
    @heroku ||= PlatformAPI.connect_oauth(ENV['HEROKU_API_TOKEN'])
  end

  def self.create_app_for(app)
    app_name = create_app_name

    heroku.app.create(name: app_name)

    app.update_attributes(heroku_app: app_name)
  end

  # 'plan' is in format 'addon_slug:plan_slug'
  def self.create_addon(app_addon, plan)
    app = app_addon.app
    addon = app_addon.addon

    create_app_for(app) if app.heroku_app.nil?

    if addon.prevent_deprovision && AppAddon.unscoped.where(app_id: app.id, addon_id: addon.id).count > 1
      # If we're preventing the deprovision of this Addon (aka. keeping it active on the Heroku app side even if the
      # user removes it on the Conflux side) AND there's more than one existing Conflux AppAddon (unscoped) for this Addon,
      # than we know the addon was already provisioned before on the Heroku app. Therefore, don't create a new one.
      # *Will have to readdress this when plans can actually be chosen.
    else
      heroku.addon.create(app.heroku_app, { plan: plan })
    end

    upsert_keys_from_new_config_vars(app_addon)
  end

  def self.upsert_keys_from_new_config_vars(app_addon)
    all_app_configs = heroku.config_var.info(app_addon.app.heroku_app)

    addon_specific_configs = app_addon.addon.config_vars

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
    app = app_addon.app
    addon = app_addon.addon

    if app.heroku_app.present?
      begin
        heroku.addon.delete(app.heroku_app, addon.slug)
      rescue
        puts "Failed to remove heroku addon #{addon.slug} from app with ID: #{app.id}"
      end
    end
  end

  # 'plan' is in format 'addon_slug:plan_slug'
  def self.update_plan(app_addon, plan)
    if app_addon.app.heroku_app.present?
      heroku.addon.update(app_addon.app.heroku_app, app_addon.addon.slug, { plan: plan })
    end
  end

end