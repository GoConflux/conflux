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
  #       "contents": "/files/addons/pubnub/initializer.rb"
  #     }
  #   }
  # }

  ALLOWED_ACTIONS = ['new_library', 'new_file']

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
        job_info.has_key?('action') && job_info['action'].is_a?(String)
        job_info.has_key?('asset') && job_info['asset'].is_a?(Hash)
      }
    end

    test 'all actions are allowed' do
      data.each { |job_id, job_info|
        ALLOWED_ACTIONS.include?(job_info['action'])
      }
    end

    test 'new_library jobs have lang, name, and version string keys for their assets' do
      data.each { |job_id, job_info|
        if job_info['action'] == 'new_library'
          asset = job_info['asset']

          ['lang', 'name', 'version'].each { |key|
            asset.has_key?(key) && asset[key].is_a?(String)
          }
        end
      }
    end

    test 'new_file jobs have path and contents string keys for their assets' do
      data.each { |job_id, job_info|
        if job_info['action'] == 'new_file'
          asset = job_info['asset']

          ['path', 'contents'].each { |key|
            asset.has_key?(key) && asset[key].is_a?(String)
          }
        end
      }
    end

  end

end