class ConfigsTest < AbstractJsonTest

  # Example Configs:
  #
  # [
  #   {
  #     "name": "MY_CONFIG",
  #     "description": "My Description"
  #   }
  # ]

  DOESNT_REQUIRE_PREFIX = ['aws-redis', 'aws-pg', 'mongolab']

  def call!

    test 'configs is an array' do
      data['configs'].is_a?(Array)
    end

    return true if data['configs'].empty?

    test 'each config is a hash' do
      data['configs'].each { |config|
        raise 'Config is not hash' unless config.is_a?(Hash)
      }

      true
    end

    test 'each config has name and description string keys' do
      data['configs'].each { |config|
        name_check = config.has_key?('name') && config['name'].is_a?(String) && config['name'].present?
        desc_check = config.has_key?('description') && config['description'].is_a?(String)

        raise 'Config is not hash' unless name_check && desc_check
      }

      true
    end

    test 'configs are unique' do
      config_names = data['configs'].map { |config| config['name'] }
      config_names.length == config_names.uniq.length
    end

    test 'all config names are uppercase strings' do
      config_names = data['configs'].map { |config| config['name'] }

      config_names.each do |k|
        next if k =~ /^[A-Z][0-9A-Z_]+$/
        raise "#{k.inspect} is not a valid ENV key"
      end

      true
    end

    test 'all config vars are prefixed with the addon id' do
      return true if DOESNT_REQUIRE_PREFIX.include?(data['addon_slug'])

      config_names = data['configs'].map { |config| config['name'] }

      config_names.each do |k|
        prefix = data['addon_slug'].upcase.gsub('-', '_')

        next if k =~ /^#{prefix}_/

        raise "#{k} is not a valid ENV key - must be prefixed with #{prefix}_"
      end

      true
    end

  end

end