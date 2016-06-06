class HomeController < ApplicationController

  before_filter :check_for_current_user
  before_filter :get_user_teams_for_header

  def index
    @landing_header = true
    render component: 'Home'
  end

end