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

  def create_link
    "/#{self.team.slug}/#{self.slug}"
  end

end