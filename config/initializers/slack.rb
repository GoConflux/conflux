require 'slack'

if ENV['SLACK_TOKEN']
  Slack.configure do |config|
    config.token = ENV['SLACK_TOKEN']
  end
end