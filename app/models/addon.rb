class Addon < ActiveRecord::Base
  require 'uri'
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  has_many :app_addons, :dependent => :destroy
  has_many :addon_admins, :dependent => :destroy
  belongs_to :addon_category
  has_many :addon_likes

  scope :drafts, -> { unscoped.where(status: Status::DRAFT, is_destroyed: false) }
  scope :pending, -> { unscoped.where(status: Status::PENDING, is_destroyed: false) }
  scope :inactive, -> { unscoped.where(is_destroyed: false).where.not(status: Status::ACTIVE) }
  default_scope -> { where(status: Status::ACTIVE) }

  module Status
    DRAFT = -1
    PENDING = 0
    ACTIVE = 1
  end

  module JobTypes
    NEW_FILE = 'new_file'
    NEW_LIBRARY = 'new_library'
  end

  ICON_EXT_FOR_TYPE = {
    'image/jpg' => 'jpg',
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/svg' => 'svg',
    'image/svg+xml' => 'svg'
  }

  def prod_api
    (api || {})['production']
  end

  def valid_icon_file_types
    ICON_EXT_FOR_TYPE.keys
  end

  def ext_for_file_type(type)
    ICON_EXT_FOR_TYPE[type]
  end

  def is_heroku_dependent?
    heroku_dependent
  end

  def config_keys
    configs.map { |c| c['name'] }
  end

  def has_plan?(plan_slug)
    plan(plan_slug).present?
  end

  def plan(plan_slug)
    plans.find { |plan| plan['slug'] == plan_slug }
  end

  def plan_disabled?(plan_slug)
    plan_info = plan(plan_slug)
    plan_info.nil? || (plan_info['disabled'] === true)
  end

  def basic_plan_slug
    plans.first['slug']
  end

  def basic_plan
    "#{heroku_slug}:#{basic_plan_slug}"
  end

  def headline_features
    hf = []

    features.each { |data|
      hf.push(data['feature']) if data['headlineFeature'] === true
    }

    hf
  end

  def modal_headline_features
    hf = []

    features.each { |data|
      hf.push(data) if data['headlineFeature'] === true
    }

    hf
  end

  def index_for_plan(slug)
    plans.find_index { |plan| plan['slug'] == slug } || 0
  end

  def cost_for_plan(plan_slug)
    price = (plan(plan_slug) || {})['price']

    if price.blank? || price.to_i == 0
      'FREE'
    else
      "$#{'%.2f' % price}"
    end
  end

  def formatted_plans
    plans.map { |plan|
      price = plan['price']

      {
        'slug' => plan['slug'],
        'name' => plan['name'],
        'cost' => (price.blank? || price.to_i == 0) ? 'FREE' : "$#{'%.2f' % price}",
        'status' => (plan['disabled'] == 'true') ? 'Not Available' : 'Available'
      }
    }
  end

  def heroku_slug
    heroku_alias || slug
  end

  def is_draft?
    status == Status::DRAFT
  end

  def is_pending?
    status == Status::PENDING
  end

  def is_active?
    status == Status::ACTIVE
  end

  def display_status
    case status
      when Status::DRAFT
        'Draft'
      when Status::PENDING
        'Pending'
      when Status::ACTIVE
        'Active'
    end
  end

  def base_url
    base = api['production']['base_url'] rescue ''
    uri = URI.parse(base)
    uri.query = nil
    uri.path = ''
    uri.to_s
  end

  def resources_path
    base = api['production']['base_url'] rescue ''
    URI.parse(base).path
  end

  def sso_full_url
    api['production']['sso_url'] rescue ''
  end

  def request_creds
    [ slug, password ]
  end

  def api_requires_syslog_drain
    false # Don't have time to deal with this for now
  end

  def starting_at
    price = ((plans || []).first || {})['price']
    (price.to_i == price.to_f ? price.to_i : price.to_f.round).to_s
  end

  def ordered_features(arg_features = nil)
    arg_features = arg_features || features || []
    arg_features.sort_by { |feature| feature['index'] }
  end

  def editable_plans
    mod_plans = (plans || []).clone
    mod_features = (features || []).clone
    id_for_slug_map = {}

    # Add id's to each plan
    mod_plans.each { |plan|
      id = SecureRandom.hex(3)
      plan['id'] = id
      id_for_slug_map[plan['slug']] = id
      plan.delete('slug')
    }

    # Go through all features and replace the keys in the 'values' hash with these new id's
    mod_features.each { |feature|
      new_values = {}

      feature['values'].each { |plan_slug, value|
        new_values[id_for_slug_map[plan_slug]] = value
      }

      feature['values'] = new_values
    }

    [mod_plans, ordered_features(mod_features)]
  end

end