module PipelineServices
  class AddDefaultTiers < AbstractService
    include AppsHelper

    attr_reader :new_bundle

    def initialize(executor_user, pipeline, add_default_local_app: true)
      super(executor_user)
      @pipeline = pipeline
      @add_default_local_app = add_default_local_app
      @new_bundle = nil
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
        # For the first pipeline, name the default local app "<TeamName> Local".
        # Afterwards, name the default local apps as "<PipelineName> Local"
        app_name = (@pipeline.team.pipelines.count == 1) ? "#{@pipeline.team.name} Local" : "#{@pipeline.name} Local"

        @new_bundle = create_new_app({
          name: app_name,
          token: UUIDTools::UUID.random_create.to_s,
          tier_id: local_dev_tier_id
        }).first
      end

      self
    end

  end
end