module AppAddonsHelper

  def url_for_db_addon(app_addon)
    app_addon.keys.find_by(name: app_addon.addon.config_vars.first).value
  end

  def compatible_for_import(source, target, is_remote_source)
    if is_remote_source
      (target.addon.is_postgres? && source.index(Addon::POSTGRES_URL_PREFIX) === 0) ||
        (target.addon.is_redis? && source.index(Addon::REDIS_URL_PREFIX) === 0) ||
        (target.addon.is_mongodb? && source.index(Addon::MONGODB_URL_PREFIX) === 0)
    else
      source.addon.compatible_with?(target.addon)
    end
  end

end
