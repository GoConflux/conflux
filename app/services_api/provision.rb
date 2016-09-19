class Provision < AbstractServicesApi

  def initialize(app_addon, plan)
    super(app_addon)
    @plan = plan || 'test'
    @external_username = conflux_id
    @external_uuid = SecureRandom.uuid
  end

  def perform
    payload = {
      conflux_id: @external_username,
      plan: @plan,
      callback_url: callback,
      logplex_token: nil,
      uuid: @external_uuid
    }

    payload[:log_drain_token] = SecureRandom.hex if addon.api_requires_syslog_drain

    @resp = post(addon.request_creds, url, path, payload)
    validate_response
    store_returned_info
  end

  private

  def validate_response
    ensure_uuids_match
    @resp_configs = @resp['config'] || {}
    ensure_all_configs_present
    ensure_all_configs_strings
    validate_url_config_vars
    log_drain_returned_if_required
  end

  # external_uuid, external_username, and configs
  def store_returned_info
    @app_addon.update_attributes(
      external_username: @external_username,
      external_uuid: @external_uuid
    )

    @resp_configs.each { |key, value|
      desc = addon.configs.find { |c| c['name'] == key }['description'] rescue nil

      Key.create!(
        app_addon_id: @app_addon.id,
        name: key,
        value: value,
        description: desc
      )
    }
  end

  def ensure_uuids_match
    raise 'Provision error: uuid\'s dont match' if @resp['id'] != @external_uuid
  end

  def ensure_all_configs_present
    diff = addon.config_keys - @resp_configs.keys

    unless diff.empty?
      raise "Config(s) missing from #{addon.slug} provision response: #{diff.join(', ')}."
    end
  end

  def ensure_all_configs_strings
    @resp_configs.each { |k, v|
      raise "Value for #{k} config is not a string" unless v.is_a?(String)
    }
  end

  def validate_url_config_vars
    @resp_configs.each do |key, value|
      next unless key =~ /_URL$/
      errors = []

      begin
        uri = URI.parse(value)
        errors.push("#{value} is not a valid URI - missing host") unless uri.host
        errors.push("#{value} is not a valid URI - missing scheme") unless uri.scheme

        raise "URL Config Errors: #{errors.join(', ')}" unless errors.empty?
      rescue URI::Error
        raise "#{value} is not a valid URI"
      end
    end
  end

  def log_drain_returned_if_required
    return unless addon.api_requires_syslog_drain
    drain_url = response['log_drain_url']
    raise 'Must return a log_drain_url' unless drain_url.present?

    unless drain_url =~ /\A(https|syslog):\/\/[\S]+\Z/
      raise 'Must return a syslog_drain_url like syslog://log.example.com:9999'
    end
  end

end