module AddonServices
  class FilterAddons < AbstractService

    attr_reader :addons

    def initialize(executor_user, query)
      super(executor_user)
      @query = query || ''
      @addons = []
    end

    def perform
      match = Addon.arel_table[:name].matches("%#{@query}%")

      addons_map = Addon.includes(:addon_category)
        .where(match)
        .group_by { |addon| addon.addon_category.category }

      AddonCategory::CATEGORIES_BY_PRIORITY.each { |category|
        addons = addons_map[category].sort_by { |addon| addon.name.downcase }.map { |addon|
          {
            name: addon.name,
            icon: addon.icon,
            tagline: addon.tagline
          }
        }

        @addons << [category, addons]
      }

      self
    end

  end
end