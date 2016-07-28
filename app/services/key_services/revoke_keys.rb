module KeyServices
  class RevokeKeys < AbstractService

    def initialize(executor_user, app_addon, specific_key: nil)
      super(executor_user)
      @app_addon = app_addon
      @specific_key = specific_key
    end

    def perform
      keys_map = {}

      @app_addon.keys.each { |key|
        if (@specific_key.present? && @specific_key == key) || @specific_key.nil?
          keys_map[key.name] = key.value
        end
      }

      addon = @app_addon.addon
      url = addon.get_revoke_keys_path
      addon_token = addon.get_token

      [keys_map, url, addon_token].each { |var|
        if var.blank?
          raise "Not all required values present to proceed with Key Revocation for AppAddon with id: #{@app_addon.id}"
        end
      }

      RestClient.post(url, keys_map, { 'Conflux-Token' => addon_token }){ |response, request, result, &block|
        body = JSON.parse(response.body)

        if response.code == 200
          update_keys(body)
          remove_app_keys_from_redis
        else
          raise "Request to Addon Provider to Revoke Key(s) Failed with Error: #{body}"
        end
      }
    end

    def update_keys(body)
      (body || {}).each { |key, value|
        key_instance = Key.find_by(app_addon_id: @app_addon.id, name: key)

        if key_instance.nil?
          raise "Can't find key (#{key}) to update with new value during key revocation for AppAddon with ID: #{@app_addon.id}"
        end

        key_instance.update_attributes(value: value)
      }
    end

    def remove_app_keys_from_redis
      AppServices::RemoveAppKeysFromRedis.new(
        @executor_user,
        @app_addon.app_scope.app
      ).perform
    end

  end
end
