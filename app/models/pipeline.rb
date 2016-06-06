class Pipeline < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable
  include FriendlyId

  acts_as_soft_destroyable

  before_create :generate_uuid

  belongs_to :team
  has_many :tiers, :dependent => :destroy
  has_many :apps, :through => :tiers

  friendly_id :slug_candidates, use: :slugged

  def slug_candidates
    [:name]
  end

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