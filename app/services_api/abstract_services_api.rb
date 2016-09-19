class AbstractServicesApi
  include ServiceHttpHelper

  attr_accessor :addon, :url, :path

  def initialize(app_addon, sso = false)
    @app_addon = app_addon
    @addon = app_addon.addon

    if sso
      @url = @addon.sso_full_url
      raise "No sso_url exists for addon: #{@addon.slug}" if @url.blank?
    else
      @url = @addon.base_url
      raise "No base_url exists for addon: #{@addon.slug}" if @url.blank?

      @path = @addon.resources_path
      raise "No resources_path exists for addon: #{@addon.slug}" if @path.blank?
    end
  end

  def perform
    raise 'You must implement \'perform\' within your child service before calling it'
  end

  def conflux_id
    "app#{rand(10000)}@goconflux.com"
  end

  def callback
    'http://localhost:7779/callback/999'
  end

end