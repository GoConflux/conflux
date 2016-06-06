class WelcomeMailer < UserMailer

  def welcome(user)
    send_email(user.email, 'Welcome to Conflux!')
  end

end