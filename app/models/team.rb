class Team < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable
  include Extensions::Slug

  acts_as_soft_destroyable

  SLUG_SOURCE = 'name'
  before_create :generate_slug
  before_create :generate_uuid

  has_many :team_users, :dependent => :destroy
  has_many :pipelines, :dependent => :destroy
  has_many :tiers, :through => :pipelines
  has_many :apps, :through => :tiers


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
