class User < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  has_many :team_users, :dependent => :destroy
  has_many :teams, :through => :team_users
  has_many :user_tokens, :dependent => :destroy
  has_many :addon_admins, :dependent => :destroy
  has_many :addon_likes

  DEFAULT_PIC = "#{ENV['CLOUDFRONT_URL']}/images/user.svg"

  def all_team_attrs
    self.teams.map { |team|
      {
        uuid: team.uuid,
        slug: team.slug,
        name: team.name,
        icon: team.icon
      }
    }
  end

  def apps_by_team
    map = {}

    self.team_users.includes(:team => [:tiers => :apps]).each { |team_user|
      map[team_user.team.name] = team_user.apps_for_role.map(&:slug).sort
    }

    map
  end

  def app(app_slug)
    app = nil

    self.team_users.includes(:team => [:tiers => :apps]).each { |team_user|
      app = team_user.apps_for_role.find { |app| app.slug == app_slug }
      return app if app.present?
    }

    app
  end

  def is_conflux_admin?
    ENV['CONFLUX_ADMINS'] && (ENV['CONFLUX_ADMINS'] || '').split(',').include?(email)
  end

end