module AppServices
  class CheckNameAvailability < AbstractService

    attr_reader :available

    def initialize(executor_user, model, name)
      super(executor_user)
      @model = model
      @name = name
    end

    def perform
      # @available = model.where(slug: slugify_name(@name)).count == 0

      @available = true

      self
    end

    def slugify_name

    end

  end
end
