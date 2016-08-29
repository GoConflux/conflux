class AddonsController < ApplicationController

  before_filter :check_for_current_user, :only => [:suggest]
  before_filter :set_addon, :only => [:addon]
  before_filter :addon_by_uuid, :only => [:modal_info]
  before_filter :set_current_user, :only => [:modify_draft, :submit, :approve]

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
        username: 'New Service Suggestion',
        text: "#{params[:addon]}\nFrom: #{@current_user.try(:email) || 'Unknown'}",
        icon_url: "#{ENV['CLOUDFRONT_URL']}/images/conflux-icon-white-blue-bg.png"
      )
    rescue => e
      puts "Error posting service Suggestion to Slack, with error #{e.message}"
    end

    render json: {}, status: 200
  end

  def modify_draft
    addon = Addon.drafts.find_by(uuid: params[:addon_uuid])
    assert(addon)

    begin
      AddonServices::SaveDraft.new(addon, draft_params).perform
    rescue Exception => e
      puts "Error modifying draft service: #{e.message}"
      render json: { message: 'Error modifying draft service'}, status: 500
    end
  end

  def submit
    addon = Addon.drafts.find_by(uuid: params[:addon_uuid])
    assert(addon)

    begin
      with_transaction do
        AddonServices::SaveDraft.new(addon, draft_params).perform
        addon.update_attributes(status: Addon::Status::PENDING)
      end

      render json: {}, status: 200
    rescue Exception => e
      puts "Error submitting service: #{e.message}"
      render json: { message: 'Error submitting service'}, status: 500
    end
  end

  def approve
    addon = Addon.drafts.find_by(uuid: params[:addon_uuid])
    assert(addon)

    begin
      with_transaction do
        addon.update_attributes(status: Addon::Status::ACTIVE)
        UserMailer.delay.service_approved(@current_user, addon)
      end

      render json: {}, status: 200
    rescue Exception => e
      puts "Error approving service: #{e.message}"
      render json: { message: 'Error approving service'}, status: 500
    end
  end

  def draft_params
    {
      name: params[:name],
      icon: params[:icon],
      url: params[:url],
      tagline: params[:tagline],
      description: params[:description],
      category: params[:category],
      plans: params[:plans],
      features: params[:features],
      jobs: params[:jobs],
      configs: params[:configs],
      api: params[:api]
    }
  end

end