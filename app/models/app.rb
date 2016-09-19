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
  has_many :app_scopes, :dependent => :destroy
  has_many :app_addons, :through => :app_scopes
  has_many :keys, :through => :app_addons
  has_many :addons, :through => :app_addons

  def shared_app_scope
    self.app_scopes.find_by(scope: AppScope::SHARED)
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

  def keys_from_pg(team_user_id)
    map = {}

    app_addons.includes(:app_scope, :addon, :keys).where(app_scopes: { team_user_id: [nil, team_user_id] }).each { |app_addon|
      # If key doesn't exist yet, or, if app_addon belongs to a personal scope, write the key
      # This way, personal keys take priority over shared keys
      if !map.key?(app_addon.addon.name) || app_addon.personal?
        map[app_addon.addon.name] = app_addon.keys.map { |key|
          {
            'name' => key.name,
            'value' => key.value,
            'description' => key.description
          }
        }
      end
    }

    map
  end

  def clone_info
    self.app_addons.includes(:app_scope, :addon).where(app_scopes: { scope: AppScope::SHARED }).map { |app_addon|
      addon = app_addon.addon
      plans = addon.plans

      {
        name: addon.name,
        addon_uuid: addon.uuid,
        icon: addon.icon,
        plans: plans,
        selected_plan_index: plans.find_index { |p| p['slug'] == app_addon.plan } || 0
      }
    }.sort_by { |_| _[:name].downcase }
  end

end
