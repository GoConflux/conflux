class AbstractService
  include ConfluxErrors

  def initialize(executor_user)
    @executor_user = executor_user
  end

  def perform
    raise 'You must implement `perform` within your child service before calling it'
  end

  def assert(value, service_error = ConfluxErrors::UnknownError)
    raise service_error if value.blank?
  end

end
