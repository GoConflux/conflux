class TeamUser < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  belongs_to :user
  belongs_to :team
  has_many :team_user_tokens, :dependent => :destroy

  def apps_for_role
    tiers = self.team.tiers
    tiers = tiers.non_prod if self.is_limited_contrib?
    tiers.map(&:apps).flatten
  end

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

  def can_write_production_apps?
    at_least_admin?
  end

  def can_edit_app?(app)
    app.tier.is_prod? ? at_least_admin? : true
  end

  def can_edit_addon?(app_addon)
    app_addon.app_scope.app.tier.is_prod? ? at_least_admin? : true
  end

  def allow_pipeline_write_access?
    at_least_admin?
  end

end
