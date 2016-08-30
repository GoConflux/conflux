class AddonAdmin < ActiveRecord::Base
  include Extensions::SoftDestroyable

  acts_as_soft_destroyable

  belongs_to :addon
  belongs_to :user

end