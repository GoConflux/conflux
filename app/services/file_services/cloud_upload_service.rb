module FileServices
  class CloudUploadService < AbstractService

    def initialize(executor_user, file, file_path)
      @executor_user = executor_user
      @file = file
      @file_path = file_path
    end

    def perform
      resp = $s3.put_object({
        acl: 'public-read',
        body: @file,
        bucket: ENV['CONFLUX_S3_BUCKET_NAME'],
        key: @file_path # I think?
      })

      self
    end

  end
end