class UserMailer < ActionMailer::Base
  require 'utils/env'

  default from: "Conflux <#{ENV['TEAM_EMAIL']}>", return_path: ENV['TEAM_EMAIL']

  def welcome(user)
    @email = user.email
    send_email(@email, 'Welcome to Conflux', 'Ben from Conflux <ben@conflux.com>')
  end

  def invite_new_user_to_team(user, inviter, team)
    @temp_password = user.password
    @email = user.email
    @inviter_name = inviter.name || inviter.email
    @team = team.name
    send_email(@email, 'You\'ve been added to a Conflux team')
  end

  def invite_existing_user_to_team(user, inviter, team)
    @email = user.email
    @name = user.name
    @inviter_name = inviter.name || inviter.email
    @team = team.name
    send_email(@email, 'You\'ve been added to a Conflux team')
  end

  def forgot_password(user)
    @email = user.email
    @name = user.name
    @password = user.password
    send_email(@email, 'Your Conflux Password')
  end

  def invite_user_by_email(email, inviter)
    @inviter_name = inviter.name || inviter.email
    send_email(email, 'You\'ve been invited to Conflux')
  end

  def service_approved(user, addon)
    @email = user.email
    @service = addon.name
    @service_link = "#{ENV['CONFLUX_USER_ADDRESS']}/services/#{addon.slug}"
    send_email(@email, "Your Conflux service, #{@service}, has been approved")
  end

  def send_email(email, subject, custom_from = nil)
    set_global_template_vars

    if email.present?
      if Utils::Env.is_enabled?('MAILER_PERFORM_DELIVERIES')

        logger.info { "SENDING EMAIL TO: #{email}" }

        custom_from.present? ?
          mail(to: ENV['MAIL_TO_OVERRIDE'] || email, subject: subject, from: custom_from) :
          mail(to: ENV['MAIL_TO_OVERRIDE'] || email, subject: subject)
      else
        logger.info { 'NOT SENDING EMAIL: EMAIL EXISTS, BUT MAILER_PERFORM_DELIVERIES WAS NOT ENABLED' }
      end
    else
      logger.error { 'NOT SENDING EMAIL: EMAIL IS NIL' }
    end
  end

  def set_global_template_vars
    @redirect_base_url = ENV['CONFLUX_USER_ADDRESS']
    @company_logo = "#{ENV['CLOUDFRONT_URL']}/images/conflux-long-white-colored-icon.png"
  end

end