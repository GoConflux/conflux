class Team < ActiveRecord::Base
  include Extensions::UUID
  include Extensions::SoftDestroyable
  include Extensions::Slug

  acts_as_soft_destroyable

  SLUG_SOURCE = 'name'
  before_save :generate_slug
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

  def formatted_team_users(current_team_user)
    team_users = []
    team_users_map = self.team_users.includes(:user).group_by(&:role)

    add_users = lambda { |team_users_array, limited = false|
      role_users = []

      team_users_array.each { |team_user|
        user = team_user.user

        tu_data = {
          email: user.email,
          name: user.name,
          pic: user.pic,
          role: team_user.role,
          is_owner: team_user.role == Role::OWNER,
          is_admin: team_user.role == Role::ADMIN
        }

        tu_data[:limited] = true if limited

        role_users.push(tu_data)
      }

      team_users += role_users.sort_by { |_| _[:email].downcase }
    }

    # Add Owner
    add_users.call((team_users_map[Role::OWNER] || []))

    # Add Admins
    add_users.call((team_users_map[Role::ADMIN] || []))

    # If current team_user is at least an admin, separate the limited contributors from regular contributors
    if current_team_user.try(:at_least_admin)
      add_users.call((team_users_map[Role::CONTRIBUTOR] || []))
      add_users.call((team_users_map[Role::CONTRIBUTOR_LIMITED] || []), true)

    # Otherwise, just combine all contributors so that non-admins don't know who has what role
    else
      regular_contribs = team_users_map[Role::CONTRIBUTOR] || []
      limited_contribs = team_users_map[Role::CONTRIBUTOR_LIMITED] || []

      add_users.call(regular_contribs + limited_contribs)
    end

    team_users
  end

end
