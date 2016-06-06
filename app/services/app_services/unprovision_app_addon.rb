module AppServices
  class UnprovisionAppAddon < AbstractService
    include Heroku

    def initialize(executor_user, app_addon)
      super(executor_user)
      @app_addon = app_addon
      @addon = app_addon.addon
    end

    def perform
      @addon.is_heroku_dependent? ? Heroku.remove_addon(@app_addon) : unprovision_conflux_addon
      self
    end

    def unprovision_conflux_addon
      # Do pretty much exactly what Heroku does to unprovision an addon
    end

  end
end