class AddonsController < ApplicationController

  before_filter :check_for_current_user, :only => [:suggest]
  before_filter :set_addon, :only => [:addon]
  before_filter :addon_by_uuid, :only => [:modal_info]

  # Get all addons for the Addons page
  def index
    data = Addons.all.map { |addon|
      {
        name: addon.name,
        icon: addon.icon,
        description: addon.tagline
      }
    }

    render component: 'Addons', props: data
  end

  # Get a specific addon for an addon's details page
  def addon
    data = {
      name: @addon.name,
      icon: @addon.icon,
      description: @addon.tagline
    }

    render component: 'Addon', props: data
  end

  def search
    if params[:query].blank?
      render json: []
      return
    end

    match = Addon.arel_table[:name].matches("%#{params[:query]}%")

    addons = Addon.where(match).order('LOWER(name)').map { |addon|
      {
        text: addon.name,
        value: addon.uuid,
        icon: addon.icon
      }
    }

    render json: addons
  end

  def modal_info
    render json: {
      name: @addon.name,
      addon_uuid: @addon.uuid,
      icon: @addon.icon,
      description: @addon.tagline,
      plans: @addon.plans,
      headline_features: @addon.headline_features
    }
  end

  def suggest
    begin
      Slack.chat_postMessage(
        channel: ENV['SLACK_FEEDBACK_CHANNEL'],
        username: 'New Add-on Suggestion',
        text: "#{params[:addon]}\nFrom: #{@current_user.try(:email) || 'Unknown'}",
        icon_url: 'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/conflux-icon-white-blue-bg.png'
      )
    rescue => e
      puts "Error posting Add-on Suggestion to Slack, with error #{e.message}"
    end

    render json: {}, status: 200
  end

end