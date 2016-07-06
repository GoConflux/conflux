require 'mixpanel-ruby'

$mixpanel = Mixpanel::Tracker.new(ENV['MIXPANEL_PROJECT_TOKEN']) if ENV['MIXPANEL_PROJECT_TOKEN']