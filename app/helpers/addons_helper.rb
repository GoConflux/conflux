module AddonsHelper
  require 'slugify'
  require 'markdown_helper'

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

  def service_page_info(addon, is_admin: false, is_owner: false, edit_mode: false)
    edit_mode = false unless is_admin

    data = {
      slug: addon.slug,
      name: addon.name,
      icon: addon.icon,
      tagline: addon.tagline,
      category_uuid: addon.addon_category.try(:uuid),
      links: {
        url: addon.url,
        facebook_url: addon.facebook_url,
        twitter_url: addon.twitter_url,
        github_url: addon.github_url
      },
      plans: addon.plans,
      features: addon.features
    }

    if edit_mode
      data.merge!({
        jobs: addon.jobs,
        configs: addon.configs,
        api: addon.api,
        description: addon.description
      })
    else
      addon_likes = addon.addon_likes

      data.merge!({
        likes: {
          count: addon_likes.count,
          has_liked: addon_likes.find { |_| _.user_id == @current_user.try(:id) }.present?
        },
        starting_at: addon.starting_at,
        permissions: {
          can_edit: is_admin,
          can_add_admin: is_owner
        },
        description: MarkdownHelper.render(addon.description)
      })
    end

    data
  end

end
