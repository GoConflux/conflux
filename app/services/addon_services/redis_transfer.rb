module AddonServices
  class RedisTransfer < DataTransferService

    def initialize(executor_user, source_url, target_url)
      super(executor_user, source_url, target_url)
    end

    def perform
      ensure_target_db_empty

      self
    end

    def ensure_target_db_empty
      target_keys = `redis-cli -h #{@target.host} -p #{@target.port} -a #{@target.password} && keys`
      target_keys.empty?
    end

  end
end