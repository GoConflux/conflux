module AddonServices
  class ImportData < AbstractService
    include AppAddonsHelper

    def initialize(executor_user, source, target, is_remote_source: false)
      super(executor_user)
      @source = source
      @target = target
      @is_remote_source = is_remote_source
    end

    def perform
      # Raise an error if addons are not compatible for data transfer.
      if !compatible_for_import(@source, @target, @is_remote_source)
        raise 'Import Data Error: AppAddons not compatible for data transfer.'
      end

      # Get urls for both source and target data-stores.
      source_url, target_url = db_urls

      # Transfer data from source to remote.
      data_transfer_svc.new(@executor_user, source_url, target_url).perform

      self
    end

    def data_store_urls
      source_url = @is_remote_source ? @source : url_for_db_addon(@source)
      target_url = url_for_db_addon(@target)

      [source_url, target_url]
    end

    def data_transfer_svc
      addon = @target.addon

      if addon.is_postgres?
        PGTransfer
      elsif addon.is_redis?
        RedisTransfer
      elsif addon.is_mongodb?
        MongoDBTransfer
      end
    end

  end
end