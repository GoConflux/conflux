module AddonServices
  class MongoDBTransfer < DataTransferService

    def initialize(executor_user, source_url, target_url)
      super(executor_user, source_url, target_url)
    end

    def perform
      self
    end

  end
end