class LoginController < ApplicationController

  before_filter :check_for_current_user, :only => [:index, :signup]
  before_filter :required_auth_credentials_exist, :only => [:login, :pw_reset]

  def index
    if @current_user.present?
      redirect_to controller: 'home', action: 'index'
    else
      @bg_light_gray = true
      @landing_header = true
      render component: 'Login', props: { sign_up: false }
    end
  end

  def signup
    if @current_user.present?
      redirect_to controller: 'home', action: 'index'
    else
      @bg_light_gray = true
      @landing_header = true
      render component: 'Login', props: { sign_up: true }
    end
  end

  def signout
    cookies.delete(UserToken::HEADER)
    redirect_to '/login'
  end

  def login
    begin
      with_transaction do
        login_svc = UserServices::Login.new(
          nil,
          params[:email],
          params[:password],
          name: params[:name],
          sign_up: params[:sign_up]
        ).perform

        response.headers[UserToken::HEADER] = login_svc.token

        data = {}

        if login_svc.user.teams.count == 1
          data[:redirect_url] = "/#{login_svc.user.teams.first.slug}"
        end

        track(params[:sign_up] ? 'New User' : 'User Login', { email: params[:email] })

        # Send welcome email if first time user
        UserMailer.delay.welcome(login_svc.user) if params[:sign_up]

        render json: data, status: 200
      end
    rescue Exception => e
      logger.error { "User Auth Error for User with email: #{params[:email]}, with exception #{e}" }
      render json: { message: 'User auth error' }, status: 500
    end
  end

  def reset_password
    @bg_light_gray = true
    @landing_header = true

    render component: 'ResetPassword'
  end

  def pw_reset
    user = User.find_by(
      email: params[:email],
      password: params[:password]
    )

    assert(user)

    track('Reset Password', { email: params[:email] })

    begin
      with_transaction do
        user.update_attributes(password: params[:new_password])

        ut = UserToken.new(
          user_id: user.id,
          token: UUIDTools::UUID.random_create.to_s
        )

        ut.save!

        response.headers[UserToken::HEADER] = ut.token

        render json: {}, status: 200
      end
    rescue => e
      puts "Error resetting password for #{params[:email]}, #{e.message}"
    end
  end

  def forgot_password
    user = User.find_by(email: params[:email])
    assert(user)

    UserMailer.delay.forgot_password(user)

    render json: {}, status: 200
  end

end