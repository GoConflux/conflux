module AddonServices
  class DataTransfer < AbstractService
    include AppAddonsHelper

    def initialize(executor_user, source_url, dest_url)
      super(executor_user)
      @source_url = source_url
      @dest_url = dest_url
    end

    def perform


      self
    end

  end
end