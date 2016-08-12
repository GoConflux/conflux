class DataTransferService < AbstractService
  require 'uri'

  def initialize(executor_user, source_url, target_url)
    super(executor_user)
    @source = URI.parse(source_url)
    @target = URI.parse(target_url)
  end

  def perform
    raise 'You must implement `perform` within your child service before calling it'
  end

end
