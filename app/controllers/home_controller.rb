class HomeController < ApplicationController

  before_filter :check_for_current_user

  def index
    if ENV['IS_CONFLUX_API']
      redirect_to platform_url
    else
      get_user_teams_for_header(home: true)
      @landing_header = true
      render component: 'Home', props: { authed: @current_user.present? }
    end
  end

  def explore
    get_user_teams_for_header(explore: true)
    @landing_header = true

    addons = AddonServices::FilterAddons.new(@current_user, nil).perform.addons

    render component: 'Explore', props: { addons: addons }
  end

  def toolbelt
    get_user_teams_for_header(toolbelt: true)
    @landing_header = true
    render component: 'Toolbelt', props: { authed: @current_user.present? }
  end

end