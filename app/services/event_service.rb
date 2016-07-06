class EventService < AbstractService
  require 'slack'

  def initialize(executor_user, event)
    super(executor_user)
    @event = event
  end

  def perform
    if Rails.env.production? && !@executor_user.is_conflux_admin?
      log_to_mixpanel # Log event to Mixpanel
      pipe_event_to_slack if ENV['SLACK_TOKEN'].present? # Pipe event to Slack
    end

    self
  end

  def log_to_mixpanel
    $mixpanel.track(@executor_user.email, @event)
  end

  def pipe_event_to_slack
    begin
      Slack.configure do |config|
        config.token = ENV['SLACK_TOKEN']
      end

      Slack.chat_postMessage(
        channel: ENV['SLACK_EVENT_CHANNEL'],
        username: @event,
        text: stats,
        icon_url: 'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/conflux-icon-white-blue-bg.png'
      )
    rescue => e
      puts "SLACK ERROR: Piping #{@event} event to #{ENV['SLACK_EVENT_CHANNEL']} channel for user #{@executor_user.email} failed with error: #{e.message}"
    end
  end

  def stats
    "Users: #{User.all.count}\n" \
    "Teams: #{Team.all.count}"
  end

end