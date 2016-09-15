 class JobsTest < AbstractJsonTest

  # Example Jobs:
  # {
  #   "7de945": {
  #     "action": "new_library",
  #     "asset": {
  #       "lang": "ruby",
  #       "name": "pubnub",
  #       "version": "3.6.10"
  #     }
  #   },
  #   "c1ed37": {
  #     "action": "new_file",
  #     "asset": {
  #       "path": "config/initializers/pubnub.rb",
  #       "contents": "files/addons/pubnub/initializer.rb"
  #     }
  #   }
  # }

  ALLOWED_LANGS = ['ruby']

  def call!
    test 'jobs is a hash' do
      data.is_a?(Hash)
    end

    return true if data.empty?

    test 'jobs have different ids' do
      data.keys.length == data.keys.uniq.length
    end

    test 'each job has action and asset keys' do
      data.each { |job_id, job_info|
        action_check = job_info.has_key?('action') && job_info['action'].is_a?(String) && job_info['action'].present?
        asset_check = job_info.has_key?('asset') && job_info['asset'].is_a?(Hash)

        raise 'Invalid Job Keys' unless action_check && asset_check
      }

      true
    end

    test 'all actions are allowed' do
      allowed_actions = Addon::JobTypes.constants.map{ |k| Addon::JobTypes.const_get(k) }

      data.each { |job_id, job_info|
        raise 'Invalid Job Action' unless allowed_actions.include?(job_info['action'])
      }

      true
    end

    test 'new_library jobs have lang, name, and version string keys for their assets' do
      data.each { |job_id, job_info|
        if job_info['action'] == Addon::JobTypes::NEW_LIBRARY
          asset = job_info['asset']

          ['lang', 'name', 'version'].each { |key|
            unless asset.has_key?(key) && asset[key].is_a?(String) && asset[key].present?
              raise "Missing or blank new_library job key, #{key}"
            end
          }

          lang = asset['lang']

          unless ALLOWED_LANGS.include?(lang)
            raise "Lang not supported, #{lang}. Available langs are #{ALLOWED_LANGS.join(', ')}"
          end
        end
      }

      true
    end

    test 'new_file jobs have path, contents, and name string keys for their assets' do
      data.each { |job_id, job_info|
        if job_info['action'] == Addon::JobTypes::NEW_FILE
          asset = job_info['asset']

          ['path', 'contents', 'name'].each { |key|
            unless asset.has_key?(key) && asset[key].is_a?(String) && asset[key].present?
              raise "Missing or blank new_file job key, #{key}"
            end
          }
        end
      }

      true
    end

    test 'all new_file jobs have unique paths' do
      new_file_paths = data.map { |job_id, job_info|
        job_info['action'] == Addon::JobTypes::NEW_FILE ? job_info['asset']['path'] : nil
      }.compact

      new_file_paths.length == new_file_paths.uniq.length
    end

    # Eventually need to make sure that new_file paths are unique across all addons too...

  end

end