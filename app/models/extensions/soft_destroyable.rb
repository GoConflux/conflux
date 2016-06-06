module Extensions
  module SoftDestroyable
    extend ActiveSupport::Concern

    ATTRIBUTES_DESTROYED = {
      is_destroyed: true
    }

    ATTRIBUTES_NOT_DESTROYED = {
      is_destroyed: [false, nil]
    }

    module ClassMethods
      def soft_destroy(records)
        records.update_all(Extensions::SoftDestroyable::ATTRIBUTES_DESTROYED)
      end

      def acts_as_soft_destroyable(create_default_scope: true)
        include Extensions::SoftDestroyableInclude

        if create_default_scope
          include Extensions::SoftDestroyableIncludeDefaultScope
        end
      end
    end
  end

  module SoftDestroyableInclude
    extend ActiveSupport::Concern

    included do
      scope :not_destroyed, -> { where(Extensions::SoftDestroyable::ATTRIBUTES_NOT_DESTROYED) }
      scope :destroyed, -> { where(Extensions::SoftDestroyable::ATTRIBUTES_DESTROYED) }
    end

    def destroy
      self.update_attributes!(Extensions::SoftDestroyable::ATTRIBUTES_DESTROYED)

      # Unprovision app_addon from heroku if it's heroku dependent
      if self.is_a?(AppAddon) && self.addon.is_heroku_dependent?
        AppServices::UnprovisionAppAddon.new(@current_user, self).perform
      end

      super # call destroy on all dependent models
    end

    def undestroy
      update!(is_destroyed: false) if destroyed?
    end

    def destroyed?
      is_destroyed == true
    end
  end

  module SoftDestroyableIncludeDefaultScope
    extend ActiveSupport::Concern

    included do
      default_scope -> { where(Extensions::SoftDestroyable::ATTRIBUTES_NOT_DESTROYED) }
    end
  end
end