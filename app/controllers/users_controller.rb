class UsersController < ApplicationController
  require 'slack'

  before_filter :set_current_user

  def feedback
    begin
      Slack.chat_postMessage(
        channel: ENV['SLACK_FEEDBACK_CHANNEL'],
        username: "Feedback from #{@current_user.email}#{@current_user.name.present? ? " (#{@current_user.name})" : ''}",
        text: params[:feedback],
        icon_url: "#{ENV['CLOUDFRONT_URL']}/images/conflux-icon-white-blue-bg.png"
      )
    rescue => e
      puts "Error posting Feedback to Slack, with error #{e.message}"
    end

    render json: {}, status: 200
  end

  def invite_user
    show_invalid_permissions if @current_user.nil?

    emails = params[:emails] || []

    if emails.blank?
      render json: { message: 'No emails provided' }, status: 500
    end

    emails.each { |email|
      UserMailer.delay.invite_user_by_email(email, @current_user)
    }

    render json: {}, status: 200
  end

end