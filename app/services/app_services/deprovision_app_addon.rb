module AppServices
  class DeprovisionAppAddon < AbstractService
    include Heroku

    def initialize(executor_user, app_addon)
      super(executor_user)
      @app_addon = app_addon
      @addon = app_addon.addon
    end

    def perform
      if @addon.is_heroku_dependent?
        Heroku.remove_addon(@app_addon) unless @addon.prevent_deprovision
      else
        Deprovision.new(@app_addon).perform
      end

      self
    end

  end
end