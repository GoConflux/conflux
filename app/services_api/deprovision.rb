class Deprovision < AbstractServicesApi

  def initialize(app_addon)
    super(app_addon)
  end

  def perform
    delete(addon.request_creds, url, "#{path}/#{@app_addon.external_uuid}")
  end

end
