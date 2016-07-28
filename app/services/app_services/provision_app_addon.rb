module AppServices
  class ProvisionAppAddon < AbstractService
    include Heroku

    def initialize(executor_user, app_addon, plan)
      super(executor_user)
      @app_addon = app_addon
      @addon = app_addon.addon
      @plan = plan
    end

    def perform
      @addon.is_heroku_dependent? ? Heroku.create_addon(@app_addon, @plan) : provision_conflux_addon
      self
    end

    def provision_conflux_addon
      # Do pretty much exactly what Heroku does to provision an addon
    end

  end
end