module TeamServices
  class CreateTeam < AbstractService
    include ApplicationHelper

    attr_reader :team

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

      PipelineServices::CreatePipeline.new(
        @executor_user,
        @team,
        name: "First #{@team.name} Pipeline"
      ).perform

      self
    end

  end
end
