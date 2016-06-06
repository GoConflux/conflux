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
      @addon.is_heroku_dependent? ? Heroku.update_plan(@app_addon, @plan) : change_plan_for_conflux_addon
      self
    end

    def change_plan_for_conflux_addon
      # Do pretty much exactly what Heroku does to change a plan
    end

  end
end