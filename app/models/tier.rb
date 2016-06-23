class Tier < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  belongs_to :pipeline
  has_many :apps, :dependent => :destroy

  LOCAL_DEV = 'Local Development'
  CLOUD_DEV = 'Cloud Development'
  STAGING = 'Staging'
  PROD = 'Production'

  DEFAULT_TIERS = [LOCAL_DEV, CLOUD_DEV, STAGING, PROD]

  scope :non_prod, -> { where.not(stage: DEFAULT_TIERS.index(PROD)) }

  def apps_for_tier_view
    self.apps.order('LOWER(name)').map { |app|
      {
        name: app.name,
        uuid: app.uuid,
        link: app.create_link
      }
    }
  end

  def is_prod?
    stage == DEFAULT_TIERS.index(PROD)
  end

end
