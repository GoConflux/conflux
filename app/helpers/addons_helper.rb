module AddonsHelper
  require 'slugify'
  require 'markdown_helper'

  def format_plans(plans_arr)
    id_to_slug_map = {}

    plans = plans_arr.map { |plan|
      name = plan['name']
      raise 'Plan must have a name' unless name.present?

      slug = name.slugify
      id_to_slug_map[plan['id']] = slug # features needs this information later

      {
        'slug' => slug,
        'name' => name,
        'price' => plan['price']
      }
    }

    validate_addon_json_column(PlansTest, plans)

    [plans, id_to_slug_map]
  end

  def format_jobs(jobs_map, addon_slug)
    jobs_for_db = {}
    file_jobs = []

    jobs_map.each { |job_id, job|
      job_id = job_id.include?('NEW_JOB') ? SecureRandom.hex(3) : job_id

      if job['action'] == Addon::JobTypes::NEW_FILE
        s3_file_path = "files/addons/#{addon_slug}/#{job_id}"
        file_contents = job['asset']['contents']

        # If file_contents is already equal to the s3 path, it means the file wasn't changed.
        if file_contents == s3_file_path
          jobs_for_db[job_id] = job
        else
          # If the file did change, the file is a base64 encoded string, so move the :contents key to
          # a new :file key, set :contents to the s3_file_path, and then push the job into the file_jobs array.
          job['asset']['file'] = job['asset']['contents']
          job['asset']['contents'] = s3_file_path
          file_jobs.push(job['asset'].clone)

          # Now we don't need the :file key anymore, so remove it before passing the job into the jobs_for_db map.
          job['asset'].delete('file')
          jobs_for_db[job_id] = job
        end
      else
        jobs_for_db[job_id] = job
      end
    }

    validate_addon_json_column(JobsTest, jobs_for_db)

    [jobs_for_db, file_jobs]
  end

  def validate_addon_json_column(json_test, data)
    klass = json_test.new(data)
    json_valid = klass.call
    raise "Invalid JSON Format during #{json_test.to_s}: #{klass.err_message}" unless json_valid
  end

  def service_page_info(addon, is_admin: false, is_owner: false, edit_mode: false)
    edit_mode = false unless is_admin

    data = {
      addon_uuid: addon.uuid,
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
      authed: @current_user.present?,
      status: {
        is_draft: addon.is_draft?,
        is_pending: addon.is_pending?,
        is_active: addon.is_active?
      },
      display_status: addon.display_status
    }

    if edit_mode
      plans, features = addon.editable_plans

      data.merge!({
        jobs: addon.jobs,
        configs: addon.configs,
        api: addon.is_heroku_dependent? ? {} : addon.prod_api,
        description: addon.description,
        plans: plans,
        features: features,
        api_required: !addon.is_heroku_dependent?,
        categories: AddonCategory.all.order('category').map { |c|
          {
            value: c.uuid,
            text: c.category
          }
        }
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
        description: to_markdown(addon.description),
        plans: addon.plans,
        features: addon.ordered_features,
        category: addon.addon_category.try(:category)
      })
    end

    data
  end

  def to_markdown(content)
    MarkdownHelper.format(content)
  end

  def file_matches_type(base64_string, type)
    base64_string.index("data:#{type}") == 0
  end

  def base_64_file_type(base64_string)
    base64_string.split(';base64').first.gsub('data:', '')
  end

end
