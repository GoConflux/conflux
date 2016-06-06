class TeamUser < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  belongs_to :user
  belongs_to :team
  has_many :team_user_tokens, :dependent => :destroy

end
