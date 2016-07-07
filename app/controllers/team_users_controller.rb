class TeamUsersController < ApplicationController
  include TeamUsersHelper

  before_filter :set_current_user
  before_filter :team_by_uuid, :only => [:invite]
  before_filter :set_current_team_user => [:invite]
  before_filter :team_user_by_uuid, :only => [:update, :destroy]

  def invite
    assert(params[:role])

    begin
      with_transaction do
        TeamUserServices::InviteUser.new(
          @current_user,
          params[:emails],
          @team,
          params[:role]
        ).perform
      end

      track('New User Invite', { invited: params[:emails] })

      render json: { users: formatted_team_users }
    rescue Exception => e
      error = "#{ConfluxErrors::UserInvitesFailed} - #{e}"
      logger.error { error }
      render json: { message: error }, status: 500
    end
  end

  def update
    @team = @team_user.team
    @current_team_user = TeamUser.find_by(user_id: @current_user.id, team_id: @team.id)

    if @current_team_user.nil?
      raise 'Error: You must be a part of the team you are updating a member for.'
    end

    if !@current_team_user.can_update_team_user?
      raise 'You must be an admin for this team in order to update the role of another member.'
    end

    begin
      with_transaction do
        if @team_user.role != params[:role]
          @team_user.update_attributes(role: params[:role])
        end
      end

      render json: { users: formatted_team_users }
    rescue => e
      puts "Error updating role for Team User #{@team_user.uuid} of Team #{team.name} with error: #{e.message}"
    end
  end

  def destroy
    @team = @team_user.team
    @current_team_user = TeamUser.find_by(user_id: @current_user.id, team_id: @team.id)

    if @current_team_user.nil?
      raise 'Error: You must be a part of the team you are removing a member for.'
    end

    if !@current_team_user.can_remove_team_user?
      raise 'You must be an admin for this team in order to remove a member.'
    end

    begin
      with_transaction do
        @team_user.destroy!
      end

      track('Removed User from Team', { team: @team.slug, removed: @team_user.user.email })

      render json: { users: formatted_team_users }
    rescue => e
      puts "Error destroying Team User #{@team_user.uuid} of Team #{team.name} with error: #{e.message}"
    end
  end

end