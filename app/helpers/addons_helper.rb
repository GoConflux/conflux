module AddonsHelper
  require 'slugify'

  def format_plans(plans_arr)
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
    validate_addon_json_column(FeaturesTest, features)
    features
  end

  def format_jobs(jobs_arr)
    validate_addon_json_column(JobsTest, jobs)
    jobs
  end

  def validate_addon_json_column(json_test, data)
    json_valid = json_test.new(JSON.parse(data.to_json)).call
    raise "Invalid JSON Format during #{json_test.to_s}" unless json_valid
  end

end
