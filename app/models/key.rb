class Key < ActiveRecord::Base
  include Extensions::UUID

  before_create :generate_uuid

  belongs_to :app_addon

  CONFIGS = 'configs'
  JOBS = 'jobs'

end
