module AddonServices
  class ImportData < AbstractService
    include AppAddonsHelper

    def initialize(executor_user, source, dest, is_remote_source: false)
      super(executor_user)
      @source = source
      @dest = dest
      @is_remote_source = is_remote_source
    end

    def perform
      # Raise an error if addons are not compatible for data transfer.
      if !compatible_for_import(@source, @dest, @is_remote_source)
        raise 'Import Data Error: AppAddons not compatible for data transfer.'
      end

      # Get urls for both source and destination data-stores.
      source_url, dest_url = db_urls

      # Transfer data from source to remote.
      DataTransfer.new(@executor_user, source_url, dest_url).perform

      self
    end

    def data_store_urls
      source_url = @is_remote_source ? @source : url_for_db_addon(@source)
      dest_url = url_for_db_addon(@dest)

      [source_url, dest_url]
    end

  end
end