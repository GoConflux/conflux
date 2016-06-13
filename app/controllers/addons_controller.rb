class AddonsController < ApplicationController

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

    addons = Addon.where(match).order('LOWER(name)').limit(30).map { |addon|
      {
        text: addon.name,
        value: addon.uuid
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

end