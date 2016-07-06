class UsersController < ApplicationController
  require 'slack'

  before_filter :set_current_user

  def feedback
    begin
      Slack.chat_postMessage(
        channel: ENV['SLACK_FEEDBACK_CHANNEL'],
        username: "Feedback from #{@current_user.email}#{@current_user.name.present? ? " (#{@current_user.name})" : ''}",
        text: params[:feedback],
        icon_url: 'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/conflux-icon-white-blue-bg.png'
      )
    rescue => e
      puts "Error posting Feedback to Slack, with error #{e.message}"
    end

    render json: {}, status: 200
  end

end