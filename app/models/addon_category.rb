class AddonCategory < ActiveRecord::Base
  include Extensions::UUID

  has_many :addons

  before_create :generate_uuid

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