module AddonsHelper
  require 'slugify'

  def format_plans(plans_arr)
    # This is gonna need to be modified prolly once you get the front-end structure down

    plans = plans_arr.map { |plan|
      {
        slug: plan[:name].try(:slugify),
        name: plan[:name],
        price: plan[:price]
      }
    }

    validate_addon_json_column(PlansTest, plans)
    plans
  end

  def format_features(features_arr)
    # You're gonna need to have features roped in with plans somehow to distinguish which from which

    # This is the format for features:
    #
    # [
    #   {
    #     "feature": "Feature 1",
    #     "values": {
    #       "plan1": "amount",
    #       "plan2": "amount"
    #     },
    #     "headlineFeature": true
    #   }
    # ]

    validate_addon_json_column(FeaturesTest, features)
    features
  end

  def format_jobs(jobs_arr)
    # This is the format for jobs:
    #
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

    validate_addon_json_column(JobsTest, jobs)
    jobs
  end

  def format_configs(configs_arr)

    # This is the format for configs:
    #
    # [
    #   {
    #     "name": "MY_CONFIG",
    #     "description": "My Description"
    #   }
    # ]

    validate_addon_json_column(ConfigsTest, configs)
    configs
  end

  def format_api(api)
    # This is the format for api:
    #
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

    validate_addon_json_column(ServiceApiTest, api)
    api
  end

  def validate_addon_json_column(json_test, data)
    json_valid = json_test.new(JSON.parse(data.to_json)).call
    raise "Invalid JSON Format during #{json_test.to_s}" unless json_valid
  end

end
