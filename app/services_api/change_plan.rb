class ChangePlan < AbstractServicesApi

  def initialize(app_addon, plan)
    super(app_addon)
    @plan = plan
  end

  def perform
    payload = {
      plan: @plan,
      conflux_id: @app_addon.external_username
    }

    put(addon.request_creds, url, "#{path}/#{@app_addon.external_uuid}", payload)
  end

end
