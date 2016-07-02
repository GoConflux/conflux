module AppServices
  class RemoveAppKeysFromRedis < AbstractService
    require 'rest-client'

    def initialize(executor_user, apps)
      super(executor_user)
      @apps = apps
    end

    def perform
      return if @apps.blank?

      @apps = @apps.to_a rescue [@apps]

      tokens = @apps.map(&:token)

      if tokens.present?
        RestClient.post(
          "#{ENV['DEV_SERVER_ADDRESS']}/api/remove_keys",
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


