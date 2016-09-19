class HomeController < ApplicationController
  include AddonsHelper

  before_filter :check_for_current_user, :except => [:lets_encrypt]
  before_filter :unscoped_addon_by_slug, :only => [:service, :edit_service]
  before_filter :current_addon_admin, :only => [:service, :edit_service]

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
    # Only show this page if the service is active or the user is an admin to this service.
    if @addon.is_active? || @current_addon_admin.present?
      get_user_teams_for_header(service: true)
      @landing_header = true

      is_admin = @current_addon_admin.present?
      is_owner = is_admin && @current_addon_admin.is_owner

      props = service_page_info(@addon, is_admin: is_admin, is_owner: is_owner)

      render component: 'Service', props: props
    else
      page_dne
    end
  end

  def edit_service
    if @current_addon_admin.present?
      get_user_teams_for_header(service: true)
      @landing_header = true

      is_admin = @current_addon_admin.present?
      is_owner = is_admin && @current_addon_admin.is_owner

      props = service_page_info(@addon, is_admin: is_admin, is_owner: is_owner, edit_mode: true)

      render component: 'EditService', props: props
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