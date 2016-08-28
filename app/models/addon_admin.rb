class AddonAdmin < ActiveRecord::Base

  belongs_to :addon
  belongs_to :user

end