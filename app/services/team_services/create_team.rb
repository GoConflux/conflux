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
        is_owner: true,
        is_admin: true
      )

      PipelineServices::CreatePipeline.new(
        @executor_user,
        @team,
        name: 'My First Pipeline'
      ).perform

      self
    end

  end
end
