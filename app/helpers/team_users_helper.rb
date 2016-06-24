module TeamUsersHelper

  def formatted_team_users
    team_users = []
    team_users_map = @team.team_users.includes(:user).group_by(&:role)

    add_users = lambda { |team_users_array, limited = false|
      role_users = []

      team_users_array.each { |team_user|
        user = team_user.user

        tu_data = {
          email: user.email,
          name: user.name,
          pic: user.pic,
          team_user_uuid: team_user.uuid,
          role: team_user.role,
          is_owner: team_user.is_owner?,
          is_admin: team_user.is_admin?
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
    if @current_team_user.try(:can_view_limited_contributors?)
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

  def string_role_for_int_role(role_int)
    case role_int
      when 0
        @current_team_user.can_view_limited_contributors? ?
          Role::CLIRoleNames::CONTRIBUTOR_LIMITED : Role::CLIRoleNames::CONTRIBUTOR
      when 1
        Role::CLIRoleNames::CONTRIBUTOR
      when 2
        Role::CLIRoleNames::ADMIN
      when 3
        Role::CLIRoleNames::OWNER
    end
  end

end