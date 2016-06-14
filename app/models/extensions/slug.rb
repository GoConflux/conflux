require 'slugify'

module Extensions
  module Slug
    extend ActiveSupport::Concern

    included do
      def generate_slug
        col = self.class.const_defined?('SLUG_SOURCE') ? self.class.const_get('SLUG_SOURCE') : nil

        if col.nil?
          raise 'Slug Error: generate_slug can only be used on models with a SLUG_SOURCE constant'
        end

        source = self.send(col) # Ex: self.name

        # if attribute required to create slug isn't blank
        if source.present?
          slug = source.slugify

          if self.class.find_by(slug: slug).present?
            slug = "#{slug}-#{self.class.unscoped.all.count}"
          end

          self.slug = slug
        else
          raise "Error Saving Record: #{self.class} must have a #{col} attribute assigned before saving. Slug will be nil otherwise."
        end
      end
    end
  end
end
