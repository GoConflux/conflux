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

  def format_jobs(jobs_arr, addon_slug)
    jobs_for_db = {}
    jobs_with_files = {}

    jobs_arr.each { |job|
      job_id = gen_job_id

      if job[:action] == 'new_file'
        file_path = job[:asset][:path] rescue nil

        raise 'No file path provided for new_file job' unless file_path.present?

        # Files will be named inside their addon slug's folder with the job_id as the file name
        # For example: '/files/addons/pubnub/c1ed37.rb'
        job[:asset][:contents] = "/files/addons/#{addon_slug}/#{job_id}#{File.extname(file_path)}"

        # Add the job to the hash now, while the :file key is still there
        jobs_with_files[job_id] = job

        # Get rid of the :file key and add what's left to the jobs_for_db map
        job[:asset].delete(:file)
        jobs_for_db[job_id] = job
      else
        jobs_with_files[job_id] = job
        jobs_for_db[job_id] = job
      end
    }

    validate_addon_json_column(JobsTest, jobs_for_db)

    [jobs_for_db, jobs_with_files]
  end

  def validate_addon_json_column(json_test, data)
    json_valid = json_test.new(JSON.parse(data.to_json)).call
    raise "Invalid JSON Format during #{json_test.to_s}" unless json_valid
  end

  def gen_job_id
    SecureRandom.hex(3)
  end

end
