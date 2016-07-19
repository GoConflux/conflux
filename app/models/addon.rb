class Addon < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  has_many :app_addons, :dependent => :destroy
  belongs_to :addon_category

  def is_heroku_dependent?
    self.heroku_dependent
  end

  def config_vars
    $addons[slug]['configs']
  end

  def has_plan?(plan_slug)
    $addons[slug]['plans'].map { |plan| plan['slug'] }.include?(plan_slug)
  end

  def plan_disabled?(plan_slug)
    plan_info = $addons[slug]['plans'].find { |plan| plan['slug'] == plan_slug }
    plan_info.nil? || (plan_info['disabled'] == 'true')
  end

  def plans
    $addons[slug]['plans']
  end

  def basic_plan_slug
    $addons[slug]['plans'].first['slug']
  end

  def basic_plan
    "#{self.heroku_slug}:#{$addons[slug]['plans'].first['slug']}"
  end

  def headline_features
    $addons[slug]['headlineFeatures']
  end

  def index_for_plan(slug)
    self.plans.find_index { |plan| plan['slug'] == slug } || 0
  end

  def cost_for_plan(plan_slug)
    price = ($addons[slug]['plans'].find { |plan| plan['slug'] == plan_slug } || {})['price']

    if price.blank? || price.to_i == 0
      'FREE'
    else
      "$#{'%.2f' % price}"
    end
  end

  def formatted_plans
    $addons[slug]['plans'].map { |plan|
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

end