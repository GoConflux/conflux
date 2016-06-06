class LoginController < ApplicationController

  before_filter :check_for_current_user, :only => [:index, :signup]
  before_filter :required_auth_credentials_exist, :only => [:login]

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

        render json: {}, status: 200
      end
    rescue Exception => e
      logger.error { "User Auth Error for User with email: #{params[:email]}, with exception #{e}" }
      render json: { message: 'User auth error' }, status: 500
    end
  end

end