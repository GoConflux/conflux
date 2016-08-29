module AddonServices
  class SaveDraft < AbstractService

    def initialize(executor_user, addon, attrs = {})
      super(executor_user)
      @addon = addon
      @attrs = attrs
    end

    def perform
      self
    end

  end
end