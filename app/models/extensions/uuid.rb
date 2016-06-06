module Extensions
  module UUID
    extend ActiveSupport::Concern

    included do
      def generate_uuid
        self.uuid = UUIDTools::UUID.random_create.to_s
      end
    end
  end
end
