class EventService < AbstractService
  require 'slack'

  def initialize(executor_user, event, props = {})
    super(executor_user)
    @email = executor_user.try(:email)
    @event = event
    @props = props
  end

  def perform
    log_to_mixpanel if $mixpanel.present?
    pipe_event_to_slack if ENV['SLACK_TOKEN'].present?
    self
  end

  private

  def log_to_mixpanel
    $mixpanel.track(@email || 'Unknown User', @event, @props)
  end

  def pipe_event_to_slack
    begin
      Slack.chat_postMessage(
        channel: ENV['SLACK_EVENT_CHANNEL'],
        username: @email.present? ? "#{@event} (#{@email})" : @event,
        text: stats,
        icon_url: "#{ENV['CLOUDFRONT_URL']}/images/conflux-icon-white-blue-bg.png"
      )
    rescue => e
      puts "SLACK ERROR: Piping #{@event} event to #{ENV['SLACK_EVENT_CHANNEL']} channel for user #{@email || 'Unknown User'} failed with error: #{e.message}"
    end
  end

  def stats
    stats = "Users: #{User.all.count}\nTeams: #{Team.all.count}"

    if @props.present?
      prop_stats = ''

      @props.each { |k, v|
        prop_stats += "#{k}: #{v}\n"
      }

      stats = prop_stats + stats
    end

    stats
  end

end