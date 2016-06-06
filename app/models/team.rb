class Team < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable
  include FriendlyId

  acts_as_soft_destroyable

  before_create :generate_uuid

  has_many :team_users, :dependent => :destroy
  has_many :pipelines, :dependent => :destroy
  has_many :tiers, :through => :pipelines
  has_many :apps, :through => :tiers

  friendly_id :slug_candidates, use: :slugged

  def slug_candidates
    [:name]
  end

  def pipelines_for_team_view
    self.pipelines.map { |pipeline|
      {
        name: pipeline.name,
        uuid: pipeline.uuid,
        slug: pipeline.slug
      }
    }
  end

  def create_link
    "/#{slug}"
  end

end
