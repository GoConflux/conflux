class Role < ActiveRecord::Base

  CONTRIBUTOR_LIMITED = 0
  CONTRIBUTOR = 1
  ADMIN = 2
  OWNER = 3

  module CLIRoleNames
    CONTRIBUTOR_LIMITED = 'limited'
    CONTRIBUTOR = 'contributor'
    ADMIN = 'admin'
    OWNER = 'owner'
  end

end