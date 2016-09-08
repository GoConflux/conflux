class FeaturesTest < AbstractJsonTest

  # Examples features:
  #
  # [
  #   {
  #     "feature": "Feature 1",
  #     "values": {
  #       "plan1": "amount",
  #       "plan2": "amount"
  #     },
  #     "headlineFeature": true,
  #     "index": "0"
  #   }
  # ]

  def call!
    test 'features is an array' do
      data.is_a?(Array)
    end

    return true if data.empty?

    test 'all values are hashes' do
      data.each { |feature|
        raise 'Feature is not a hash' unless feature.is_a?(Hash)
      }

      true
    end

    test 'each feature contains the correct keys' do
      data.each { |feature|
        feature_check = feature.has_key?('feature') && feature['feature'].is_a?(String) && feature['feature'].present?
        values_check = feature.has_key?('values') && feature['values'].is_a?(Hash)
        hf_check = feature.has_key?('headlineFeature') && feature['headlineFeature'].is_a?(Boolean)

        raise 'Invalid Feature Keys' unless feature_check && values_check && hf_check
      }

      true
    end

    # Eventually, do a test to check that all the plan slugs and features match up

  end

end