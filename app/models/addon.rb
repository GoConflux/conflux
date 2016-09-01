class Addon < ActiveRecord::Base
  require 'uri'
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  has_many :app_addons, :dependent => :destroy
  has_many :addon_admins, :dependent => :destroy
  belongs_to :addon_category

  scope :drafts, -> { unscoped.where(status: Status::DRAFT, is_destroyed: false) }
  scope :pending, -> { unscoped.where(status: Status::PENDING, is_destroyed: false) }
  scope :inactive, -> { unscoped.where(is_destroyed: false).where.not(status: Status::ACTIVE) }
  default_scope -> { where(status: Status::ACTIVE) }

  module Status
    DRAFT = -1
    PENDING = 0
    ACTIVE = 1
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

  def is_active?
    status == Status::ACTIVE
  end

  def service_page_info
    {}
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
    [ @addon.slug, @addon.password ]
  end

  def api_requires_syslog_drain
    false # Don't have time to deal with this for now
  end

end