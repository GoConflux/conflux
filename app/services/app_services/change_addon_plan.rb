module AppServices
  class ChangeAddonPlan < AbstractService
    include Heroku

    def initialize(executor_user, app_addon, plan)
      super(executor_user)
      @app_addon = app_addon
      @addon = app_addon.addon
      @plan = plan
    end

    def perform
      @addon.is_heroku_dependent? ?
        Heroku.update_plan(@app_addon, "#{@addon.heroku_slug}:#{@plan}") :
        ChangePlan.new(@app_addon, @plan).perform

      self
    end

  end
end