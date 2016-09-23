module TeamsHelper
  extend self

  def random_team_name(email)
    "Team #{email.split('@').first}"
  end

end