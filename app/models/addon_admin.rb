class AddonAdmin < ActiveRecord::Base

  acts_as_soft_destroyable

  belongs_to :addon
  belongs_to :user

end