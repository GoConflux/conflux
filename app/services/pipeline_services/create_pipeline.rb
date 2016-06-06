module PipelineServices
  class CreatePipeline < AbstractService

    attr_reader :pipeline

    def initialize(executor_user, team, name: nil, description: nil)
      super(executor_user)
      @team = team
      @name = name
      @description = description
    end

    def perform
      @pipeline = Pipeline.find_or_initialize_by(
        name: @name,
        team_id: @team.id
      )

      # Error out if Pipeline with that name already exists for that Team
      if @pipeline.persisted?
        raise "Pipeline #{@name} already exists for Team #{@team.name}"
      end

      @pipeline.assign_attributes(
        description: @description
      )

      @pipeline.save!

      # Add the default Tiers for a Pipeline
      PipelineServices::AddDefaultTiers.new(
        @executor_user,
        @pipeline
      ).perform

      self
    end

  end
end
