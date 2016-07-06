class AddonCategory < ActiveRecord::Base
  has_many :addons

  CATEGORIES_BY_PRIORITY = [
    'Data Stores',
    'Email',
    'Messaging',
    'Content',
    'Media Processing',
    'Network Services',
    'Search'
  ]

end