module FileServices
  class CloudUploadService < AbstractService

    def initialize(executor_user, file, file_path, file_type, base64: true)
      @executor_user = executor_user
      @file = base64 ? Base64.decode64(file.split('base64,').last) : file
      @file_path = file_path
      @file_type = file_type
    end

    def perform
      $s3.put_object({
        acl: 'public-read',
        body: @file,
        bucket: ENV['CONFLUX_S3_BUCKET_NAME'],
        content_type: @file_type,
        key: @file_path
      })

      self
    end

  end
end