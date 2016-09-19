class ServiceApiTest < AbstractJsonTest

  # Example api:
  # #
  # {
  #   "production": {
  #     "base_url": "https://yourapp.com/conflux/resources",
  #     "sso_url": "https://yourapp.com/conflux/sso"
  #   },
  #   "test": {
  #     "base_url": "http://localhost:#{default_port}/conflux/resources",
  #     "sso_url": "http://localhost:#{default_port}/conflux/sso"
  #   }
  # }

  def call!
    test 'api is a hash' do
      data.is_a?(Hash)
    end

    test 'api has production and test hash keys' do
      prod_check = data.has_key?('production') && data['production'].is_a?(Hash)
      test_check = data.has_key?('test') && data['test'].is_a?(Hash)
      prod_check && test_check
    end

    test 'both api keys have hashes with base_url and sso_url string keys' do
      ['production', 'test'].each { |scope|
        base_url_check = data[scope].has_key?('base_url') && data[scope]['base_url'].is_a?(String)
        sso_url_check = data[scope].has_key?('sso_url') && data[scope]['sso_url'].is_a?(String)

        unless base_url_check && sso_url_check
          raise "Invalid api url(s) for #{scope} scope"
        end
      }

      true
    end

    test 'production keys use SSL' do
      ssl_for_base_url = data['production']['base_url'] =~ /^https:/
      ssl_for_sso_url = data['production']['sso_url'] =~ /^https:/
      ssl_for_base_url && ssl_for_sso_url
    end

  end

end