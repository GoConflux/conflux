class AddonCategory < ActiveRecord::Base
  include Extensions::UUID

  has_many :addons # leaving off :dependent => :destroy here bc I don't wanna risk it

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