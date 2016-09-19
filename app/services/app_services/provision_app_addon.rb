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
      @addon.is_heroku_dependent? ?
        Heroku.create_addon(@app_addon, "#{@addon.heroku_slug}:#{@plan}") :
        Provision.new(@app_addon, @plan).perform

      self
    end

  end
end