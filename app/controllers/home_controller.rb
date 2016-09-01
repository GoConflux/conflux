class HomeController < ApplicationController

  before_filter :check_for_current_user, :except => [:lets_encrypt]

  def index
    if ENV['IS_CONFLUX_API']
      redirect_to platform_url
    else
      get_user_teams_for_header(home: true)
      @landing_header = true
      render component: 'Home', props: { authed: @current_user.present? }
    end
  end

  def services
    get_user_teams_for_header(explore: true)
    @landing_header = true

    addons = AddonServices::FilterAddons.new(@current_user).perform.addons

    render component: 'Explore', props: { addons: addons }
  end

  def service
    addon = Addon.unscoped.find_by(slug: params[:addon_slug], is_destroyed: false)
    page_dne && return if addon.nil?

    current_user_addon_admin = addon.addon_admins.find_by(user_id: @current_user.id)

    if addon.is_active? || current_user_addon_admin.present?
      render component: 'Service', props: {
        info: addon.service_page_info,
        is_admin: current_user_addon_admin.present?,
        is_owner: current_user_addon_admin.is_owner,
      }
    else
      page_dne
    end
  end

  def download
    get_user_teams_for_header(toolbelt: true)
    @landing_header = true
    render component: 'Toolbelt', props: { authed: @current_user.present? }
  end

  def lets_encrypt
    render text: 'my-key'
  end

end