class AddonLike < ActiveRecord::Base
  belongs_to :addon
  belongs_to :user
end