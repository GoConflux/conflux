class TeamUsersController < ApplicationController

  before_filter :set_current_user
  before_filter :team_by_uuid, :only => [:invite]

  def invite
    begin
      with_transaction do
        email_queue = []

        (params[:emails] || []).each { |email|
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
            UserMailer.delay.invite_new_user_to_team(data[:user], @current_user, @team) :
            UserMailer.delay.invite_existing_user_to_team(data[:user], @current_user, @team)
        }
      end

      render json: {}, status: 200
    rescue Exception => e
      error = "#{ConfluxErrors::UserInvitesFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

end