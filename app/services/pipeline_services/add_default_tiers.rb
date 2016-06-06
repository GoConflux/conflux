module PipelineServices
  class AddDefaultTiers < AbstractService

    def initialize(executor_user, pipeline, add_default_local_app: true)
      super(executor_user)
      @pipeline = pipeline
      @add_default_local_app = add_default_local_app
    end

    def perform
      # First lets ensure this pipeline doesn't have any tiers yet
      if @pipeline.tiers.count > 0
        raise 'Pipeline should not have any tiers yet!'
      end

      local_dev_tier_id = nil

      Tier::DEFAULT_TIERS.each_with_index { |name, index|
        tier = Tier.create!(
          name: name,
          stage: index,
          pipeline_id: @pipeline.id
        )

        local_dev_tier_id = tier.id if index == 0
      }

      if @add_default_local_app
        App.create!(
          name: App::DEFAULT_LOCAL_APP_NAME,
          token: UUIDTools::UUID.random_create.to_s,
          tier_id: local_dev_tier_id
        )
      end

      self
    end

  end
end