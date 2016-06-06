module AppServices
  class RemoveAppKeysFromRedis < AbstractService
    require 'rest-client'

    def initialize(executor_user, apps)
      super(executor_user)
      assert(apps, 'apps cannot be nil when calling RemoveAppKeysFromRedis')
      @apps = apps.to_a rescue [apps]
    end

    def perform
      tokens = @apps.map(&:token)

      if tokens.present?
        RestClient.post(
          "#{ENV['DEV_SERVER_ADDRESS']}/remove_keys",
          { tokens: tokens },
          { 'Conflux-Token' => ENV['TOP_LEVEL_CONFLUX_TOKEN'] }
        )
      else
        logger.error { "Error performing RemoveAppKeysFromRedis: Apps had no tokens...Check apps with ids: #{@apps.map(&:id)}" }
      end

      self
    end

  end
end


