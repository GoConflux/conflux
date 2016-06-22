class TeamUser < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  belongs_to :user
  belongs_to :team
  has_many :team_user_tokens, :dependent => :destroy

  def is_limited_contrib?
    role === Role::CONTRIBUTOR_LIMITED
  end

  def is_regular_contrib?
    role === Role::CONTRIBUTOR
  end

  def is_admin?
    role === Role::ADMIN
  end

  def is_owner?
    role === Role::OWNER
  end

  def at_least_regular_contrib?
    role >= Role::CONTRIBUTOR
  end

  def at_least_admin?
    role >= Role::ADMIN
  end

  def can_invite_team_user?
    at_least_admin?
  end

  def can_update_team_user?
    at_least_admin?
  end

  def can_remove_team_user?
    at_least_admin?
  end

  def can_view_limited_contributors?
    at_least_admin?
  end

  def can_read_production_apps?
    at_least_regular_contrib?
  end

  def can_add_new_addons_to_app?(app)
    if app.tier.is_prod?
      at_least_admin?
    else
      at_least_regular_contrib?
    end
  end

end
