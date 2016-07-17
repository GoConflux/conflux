class ThirdPartyOauthController < ApplicationController
  include ApplicationHelper

  before_filter :set_current_user

  TWITTER_OAUTH_TOKEN = 'Twitter-OAuth-Token'
  TWITTER_OAUTH_SECRET = 'Twitter-OAuth-Secret'

  def twitter_sign_in
    # Request an OAuth access token from Twitter, which comes with the url to direct our user to.
    request_token = twitter_client.request_token(oauth_callback: "#{ENV['CONFLUX_USER_ADDRESS']}/twitter_oauth")

    # Store twitter creds in cookie for retrieval on OAuth callback
    cookies[TWITTER_OAUTH_TOKEN] = request_token.token
    cookies[TWITTER_OAUTH_SECRET] = request_token.secret

    # Send the user to Twitter to authorize our app
    redirect_to request_token.authorize_url
  end

  def twitter_oauth
    oauth_token = cookies[TWITTER_OAUTH_TOKEN]
    oauth_secret = cookies[TWITTER_OAUTH_SECRET]

    if oauth_token.present? && oauth_secret.present?
      begin
        with_transaction do
          # Log in as the Twitter user
          twitter_client.authorize(oauth_token, oauth_secret, oauth_verifier: params[:oauth_verifier])

          # Retweet the latest Conflux publicity tweet
          twitter_client.retweet(ENV['LATEST_CONFLUX_TWEET_ID']) if ENV['LATEST_CONFLUX_TWEET_ID']

          # Unlock user's ability to access non-free plans
          @current_user.update_attributes(can_access_non_free_plans: true)
        end
      rescue => e
        puts "Error retweeting Conflux tweet with error: #{e.message}"
      end
    end

    redirect_to controller: 'home', action: 'index'
  end

end