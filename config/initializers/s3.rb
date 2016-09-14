require 'aws-sdk'

if ENV['S3_ACCESS_KEY_ID'] && ENV['S3_SECRET_ACCESS_KEY']
  Aws.config[:credentials] = Aws::Credentials.new(
    ENV['S3_ACCESS_KEY_ID'],
    ENV['S3_SECRET_ACCESS_KEY']
  )

  Aws.config[:region] = 'us-west-1'

  $s3 = Aws::S3::Client.new
end