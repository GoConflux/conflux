class TeamUsersApiController < ApplicationController

  before_filter :current_api_user, :only => [:invite]

  def invite
    render json: {}
  end

end