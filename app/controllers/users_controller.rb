class UsersController < ApplicationController
  require 'slack'

  before_filter :set_current_user

  def feedback
    Slack.configure do |config|
      config.token = ENV['SLACK_TOKEN']
    end

    begin
      Slack.chat_postMessage(
        channel: ENV['SLACK_FEEDBACK_CHANNEL'],
        username: "Feedback from #{@current_user.email}#{@current_user.name.present? ? " (#{@current_user.name})" : ''}",
        text: params[:feedback]
      )
    rescue => e
      puts "Error posting Feedback to Slack, with error #{e.message}"
    end

    render json: {}, status: 200
  end

end