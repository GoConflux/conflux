class HomeController < ApplicationController

  before_filter :check_for_current_user

  def index
    get_user_teams_for_header(home: true)
    @landing_header = true
    render component: 'Home', props: { authed: @current_user.present? }
  end

  def explore
    get_user_teams_for_header(explore: true)
    @landing_header = true

    addons = AddonServices::FilterAddons.new(@current_user, nil).perform.addons

    render component: 'Explore', props: { addons: addons }
  end

end