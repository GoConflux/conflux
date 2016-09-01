class Sso < AbstractServicesApi
  require 'mechanize'

  def initialize(app_addon)
    sso = true
    super(app_addon, sso)
  end

  def perform
    timestamp = Time.now.to_i.to_s
    token = create_sso_token(timestamp)

    Mechanize.new.post(
      @url,
      {
        'id' => @app_addon.external_uuid,
        'token' => token,
        'timestamp' => timestamp,
        'email' => @app_addon.external_username
      }
    )
  end

  def create_sso_token(timestamp)
    Digest::SHA1.hexdigest([@app_addon.external_uuid, @addon.sso_salt, timestamp].join(':'))
  end

end
