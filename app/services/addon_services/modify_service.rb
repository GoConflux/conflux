module AddonServices
  class ModifyService < AbstractService

    def initialize(executor_user, addon, attrs = {})
      super(executor_user)
      @addon = addon
      @attrs = attrs
    end

    def perform
      check_permissions



      self
    end

    private

    def check_permissions
      @addon_admin = @addon.addon_admins.find_by(user_id: @executor_user.id).nil?
      raise 'Invalid Permissions' if @addon_admin.nil?
    end

  end
end