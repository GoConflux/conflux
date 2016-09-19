class AddonsController < ApplicationController
  include AddonsHelper

  before_filter :check_for_current_user, :only => [:suggest]
  before_filter :set_addon, :only => [:addon]
  before_filter :addon_by_uuid, :only => [:modal_info, :like, :unlike, :add_admin, :remove_admin, :admin]
  before_filter :set_current_user, :only => [:modify, :submit, :approve, :like, :unlike, :add_admin, :remove_admin, :admin]
  before_filter :current_addon_admin, :only => [:add_admin, :remove_admin, :admin]
  before_filter :user_by_uuid, :only => [:remove_admin]

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
      headline_features: @addon.modal_headline_features
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

  def modify
    addon = Addon.unscoped.find_by(uuid: params[:addon_uuid], is_destroyed: false)
    assert(addon)

    begin
      with_transaction do
        AddonServices::ModifyService.new(@current_user, addon, draft_params(addon)).perform
      end

      render json: { url: "/services/#{addon.slug}" }
    rescue Exception => e
      puts "Error modifying draft service: #{e.message}"
      render json: { message: 'Error modifying draft service'}, status: 500
    end
  end

  def submit
    addon = Addon.unscoped.find_by(uuid: params[:addon_uuid], is_destroyed: false)
    assert(addon)

    begin
      with_transaction do
        AddonServices::ModifyService.new(@current_user, addon, draft_params(addon)).perform
        addon.update_attributes(status: Addon::Status::PENDING)
      end

      Slack.chat_postMessage(
        channel: ENV['SLACK_EVENT_CHANNEL'],
        username: "New Service Submitted",
        text: "Name: #{addon.name}\nURL: #{ENV['CONFLUX_USER_ADDRESS']}/services/#{addon.slug}",
        icon_url: "#{ENV['CLOUDFRONT_URL']}/images/conflux-icon-white-blue-bg.png"
      )

      render json: { url: "/services/#{addon.slug}" }
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

  def md_preview
    render json: { content: to_markdown(params[:content]) }
  end

  def like
    begin
      count = 0

      with_transaction do
        AddonLike.find_or_create_by!(user_id: @current_user.id, addon_id: @addon.id)
        count = @addon.addon_likes.count
      end

      render json: { count: count }
    rescue Exception => e
      puts "Error Liking Service, #{@addon.name}: #{e.message}"
      render json: { message: 'Error Liking Service' }, status: 500
    end
  end

  def unlike
    begin
      count = 0

      with_transaction do
        addon_like = AddonLike.find_by(user_id: @current_user.id, addon_id: @addon.id)
        assert(addon_like)

        addon_like.destroy!
      end

      render json: { count: count }
    rescue Exception => e
      puts "Error Unliking Service, #{@addon.name}: #{e.message}"
      render json: { message: 'Error Unliking Service' }, status: 500
    end
  end

  def add_admin
    begin
      # First make sure the current_user is the owner of this addon
      assert(@current_addon_admin.is_owner)

      # Then ensure a user exists for the email provided (the user to add as an admin)
      assert(params[:email])
      user_to_add = User.find_by(email: params[:email])

      # eventually handle this on the FE and return a 404, but for now just return a 200
      if user_to_add.nil?
        admin
        return
      end

      # Error out if user is already an admin for this addon
      if @addon.addon_admins.find_by(user_id: user_to_add.id).present?
        raise 'User is already an admin for this service.'
      end

      with_transaction do
        # Add this user an an admin to this addon
        AddonAdmin.create!(user_id: user_to_add.id, addon_id: @addon.id)

        admin
      end
    rescue Exception => e
      puts "Error adding new AddonAdmin. Email: #{params[:email]}; Addon: #{@addon.slug}; Error: #{e.message}"
      render json: { message: 'Error adding new admin to service.' }, status: 500
    end
  end

  def remove_admin
    begin
      # First make sure the current_user is the owner of this addon
      assert(@current_addon_admin.is_owner)

      with_transaction do
        addon_admin = AddonAdmin.find_by(user_id: @user.id, addon_id: @addon.id)
        assert(addon_admin)

        addon_admin.destroy!

        admin
      end
    rescue Exception => e
      puts "Error removing AddonAdmin. User UUID: #{params[:user_uuid]}; Addon: #{@addon.slug}; Error: #{e.message}"
      render json: { message: 'Error adding new admin to service.' }, status: 500
    end
  end

  def admin
    assert(@current_addon_admin.is_owner)

    admin_emails = @addon.addon_admins
      .includes(:user)
      .where(is_owner: false)
      .map { |aa|
        {
          user_uuid: aa.user.uuid,
          email: aa.user.email
        }
    }.sort

    render json: { owner: @current_user.email, others: admin_emails }
  end

  def draft_params(addon)
    {
      name: params[:name],
      icon: params[:icon],
      url: params[:url],
      facebook_url: params[:facebook_url],
      twitter_url: params[:twitter_url],
      github_url: params[:github_url],
      tagline: params[:tagline],
      description: params[:description],
      category_uuid: params[:category_uuid],
      plans: params[:plans] || [],
      features: params[:features] || [],
      jobs: params[:jobs] || {},
      configs: params[:configs] || [],
      api: addon.is_heroku_dependent? ? {} : (params[:api] || {})
    }
  end

end