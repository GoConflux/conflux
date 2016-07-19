class App < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable
  include Extensions::Slug

  acts_as_soft_destroyable

  SLUG_SOURCE = 'name'
  before_create :generate_slug
  before_create :generate_uuid

  belongs_to :tier
  belongs_to :pipeline
  has_many :app_addons, :dependent => :destroy
  has_many :keys, :through => :app_addons
  has_many :addons, :through => :app_addons

  def addons_for_app_view
    self.app_addons.includes(:addon).order('addons.name').map { |app_addon|
      addon = app_addon.addon

      {
        name: addon.name,
        icon: addon.icon,
        tagline: addon.tagline,
        link: app_addon.create_link
      }
    }
  end

  def create_link
    pipeline = self.tier.pipeline

    "/#{pipeline.team.slug}/#{pipeline.slug}/#{self.slug}"
  end


  def get_back_data
    pipeline = self.tier.pipeline

    {
      url: "/#{pipeline.team.slug}/#{pipeline.slug}",
      text: pipeline.name
    }
  end

  def est_monthly_cost
    cost = 0

    self.app_addons.includes(:addon).each { |app_addon|
      cost += app_addon.monthly_cost
    }

    cost
  end

  def keys_from_pg
    map = {}

    app_addons.includes(:addon).order('addons.slug').each { |app_addon|
      map[app_addon.addon.name] = app_addon.keys.order('LOWER(name)').map { |key|
        {
          'name' => key.name,
          'value' => key.value,
          'description' => key.description
        }
      }
    }

    map
  end

  def job_ids
    all_app_job_ids = []

    app_addons.includes(:addon).each { |app_addon|
      addon_job_ids = $addons[app_addon.addon.slug]['jobs'].keys rescue []
      all_app_job_ids += addon_job_ids
    }

    all_app_job_ids
  end

end
