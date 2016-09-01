class AbstractServicesApi
  include ServiceHTTPHelper

  attr_accessor :addon, :url, :path

  def initialize(app_addon, sso = false)
    @app_addon = app_addon
    @addon = app_addon.addon

    url_method = sso ? 'sso_url' : 'base_url'
    path_method = sso ? 'sso_path' : 'resources_path'

    @url = @addon.send(url_method)
    raise "No #{url_method} exists for addon: #{@addon.slug}" if @url.blank?

    @path = @addon.send(path_method)
    raise "No #{path_method} exists for addon: #{@addon.slug}" if @path.blank?
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