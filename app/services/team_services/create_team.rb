module TeamServices
  class CreateTeam < AbstractService
    include ApplicationHelper

    attr_reader :team, :new_bundle

    def initialize(executor_user, team_data)
      super(executor_user)
      @team_data = team_data
    end

    def perform
      @team = Team.create!(allowed_creation_params_for(:team, @team_data))

      TeamUser.create!(
        user_id: @executor_user.id,
        team_id: @team.id,
        role: Role::OWNER
      )

      new_pipeline_svc = PipelineServices::CreatePipeline.new(
        @executor_user,
        @team,
        name: "#{@team.name} Pipeline"
      ).perform

      @new_bundle = new_pipeline_svc.new_bundle

      self
    end

  end
end
