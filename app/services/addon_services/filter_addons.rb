module AddonServices
  class FilterAddons < AbstractService

    attr_reader :addons

    def initialize(executor_user, query)
      super(executor_user)
      @query = query || ''
    end

    def perform
      match = Addon.arel_table[:name].matches("%#{@query}%")

      @addons = Addon.includes(:addon_category)
        .where(match)
        .group_by { |addon| addon.addon_category.category }
        .sort
        .map { |group|
          category = group[0]
          addons = group[1].sort_by { |addon| addon.name.downcase }.map { |addon|
            {
              name: addon.name,
              icon: addon.icon,
              tagline: addon.tagline
            }
          }

          [category, addons]
        }

      self
    end

  end
end