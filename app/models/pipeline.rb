class Pipeline < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable
  include Extensions::Slug

  acts_as_soft_destroyable

  SLUG_SOURCE = 'name'
  before_create :generate_slug
  before_create :generate_uuid

  belongs_to :team
  has_many :tiers, :dependent => :destroy
  has_many :apps, :through => :tiers

  def tiers_for_pipeline_view
    self.tiers.order(:stage).map { |tier|
      {
        name: tier.name,
        stage: tier.stage,
        uuid: tier.uuid,
        apps: tier.apps_for_tier_view
      }
    }
  end

  def create_link
    "/#{self.team.slug}/#{self.slug}"
  end

end