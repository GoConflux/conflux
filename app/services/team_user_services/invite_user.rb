module TeamUserServices
  class InviteUser < AbstractService
    include ApplicationHelper

    def initialize(executor_user, emails = [], team)
      super(executor_user)
      @emails = emails
      @team = team
    end

    def perform
      email_queue = []

      @emails.each { |email|
        new_user = false

        # First create the user if they don't exist
        user = User.find_or_initialize_by(email: email)

        if !user.persisted?
          send_email = true
          new_user = true
          user.password = generate_temp_password
          user.save!
        end

        # Then create the team_user for them if that doesn't exist
        team_user = TeamUser.find_or_initialize_by(
          user_id: user.id,
          team_id: @team.id
        )

        if !team_user.persisted?
          send_email = true
          team_user.save!
        end

        if send_email
          email_queue.push({ user: user,  new_user: new_user })
        end
      }

      email_queue.each { |data|
        data[:new_user] ?
          UserMailer.delay.invite_new_user_to_team(data[:user], @executor_user, @team) :
          UserMailer.delay.invite_existing_user_to_team(data[:user], @executor_user, @team)
      }
    end

  end
end
