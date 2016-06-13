class HomeController < ApplicationController

  before_filter :check_for_current_user

  def index
    get_user_teams_for_header(true)
    @landing_header = true
    render component: 'Home'
  end

end