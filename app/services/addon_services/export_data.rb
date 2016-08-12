module AddonServices
  class ExportData < AbstractService

    def initialize(executor_user, query)
      super(executor_user)
      @query = query || ''
      @addons = []
    end

    def perform

      self
    end

  end
end