class UserToken < ActiveRecord::Base
  belongs_to :user

  HEADER = 'Conflux-User'

  def is_expired?
    # put some calculation here
    false
  end

end
