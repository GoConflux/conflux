module AddonServices
  class FilterAddons < AbstractService

    attr_reader :addons

    def initialize(executor_user, query)
      super(executor_user)
      @query = query || ''
    end

    def perform
      match = Addon.arel_table[:name].matches("%#{@query}%")

      @addons = Addon.where(match).order('LOWER(name)').map { |addon|
        {
          name: addon.name,
          icon: addon.icon,
          tagline: addon.tagline,
        }
      }

      self
    end

  end
end