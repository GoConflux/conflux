class User < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  before_create :generate_uuid

  has_many :team_users, :dependent => :destroy
  has_many :teams, :through => :team_users
  has_many :user_tokens, :dependent => :destroy

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

    self.teams.order(:slug).includes(:apps).each { |team|
      map[team.name] = team.apps.order(:slug).map(&:slug)
    }

    map
  end

  def apps
    App.includes(:tier => [:pipeline => [:team => :team_users]])
      .where(team_users: { user_id: self.id })
  end

  def app(app_slug)
    apps.where(slug: app_slug).take
  end

end