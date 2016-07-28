class AppScope < ActiveRecord::Base
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  belongs_to :app
  belongs_to :team_user
  has_many :app_addons, :dependent => :destroy

  # Scopes:
  SHARED = 0
  PERSONAL = 1

end