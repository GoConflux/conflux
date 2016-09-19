class AppAddon < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  belongs_to :app_scope
  belongs_to :addon
  has_many :keys, :dependent => :destroy

  def keys_for_app_addon_view
    self.keys.order('LOWER(name)').map { |key|
      {
        name: key.name,
        value: key.value,
        description: key.description,
        key_uuid: key.uuid
      }
    }
  end

  # ONLY FOR UPDATING KEYS - THIS ASSUMES KEY COUNT HAS NOT CHANGED
  # keys_map should be a map of key_uuid --> key data
  def update_keys(keys_map)
    keys = Key.where(uuid: keys_map.keys)

    keys.each { |key|
      key_attrs = keys_map[key.uuid]

      key.update_attributes(
        name: key_attrs[:name],
        value: key_attrs[:value],
        description: key_attrs[:description]
      )
    }
  end

  def create_link
    pipeline = self.app_scope.app.tier.pipeline
    addon_slug = "#{self.addon.slug}#{self.app_scope.scope == AppScope::PERSONAL ? '-personal' : ''}"

    "/#{pipeline.team.slug}/#{pipeline.slug}/#{self.app_scope.app.slug}/#{addon_slug}"
  end

  def get_back_data
    pipeline = self.app_scope.app.tier.pipeline

    {
      url: "/#{pipeline.team.slug}/#{pipeline.slug}/#{self.app_scope.app.slug}",
      text: self.app_scope.app.name
    }
  end

  def plan_info
    self.addon.plans[self.addon.index_for_plan(plan)]
  end

  def monthly_cost
    self.plan_info['price'].to_f
  end

  def personal?
    self.app_scope.personal?
  end

  def shared?
    self.app_scope.shared?
  end

  def links
    []

    # WHEN SSO IS READY:
    # ----------------------
    # addon = self.addon
    # return [] if addon.is_heroku_dependent?
    #
    # [
    #   {
    #     name: "Open #{addon.name}",
    #     href: "/sso/#{uuid}"
    #   }
    # ]
  end

end
