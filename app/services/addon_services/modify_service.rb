module AddonServices
  class ModifyService < AbstractService
    include AddonsHelper

    def initialize(executor_user, addon, attrs = {})
      super(executor_user)
      @addon = addon
      @attrs = attrs
      @updates = {}
    end

    def perform
      # Ensure @executor_user is an addon_admin for this addon.
      check_permissions

      # Prep the @updates map with the attrs that can be inserted straight into the addon record as they are.
      add_simple_attrs_to_updates

      # Upsert AddonCategory.
      check_for_category_update

      # Upload the icon to S3.
      update_icon

      # Update pricing plans.
      update_plans

      # Update list of features for each plan.
      update_features

      # Update addon-specific jobs which run post-addon-provisioning.
      update_jobs

      # Update config vars for this addon, including descriptions.
      update_configs

      # Update API for this addon (which endpoints to hit for provisioning/sso/etc.)
      update_api unless @addon.is_heroku_dependent?

      @addon.update_attributes(@updates)

      self
    end

    private

    def check_permissions
      @addon_admin = @addon.addon_admins.find_by(user_id: @executor_user.id).nil?
      raise 'Invalid Permissions' if @addon_admin.nil?
    end

    def add_simple_attrs_to_updates
      @updates.merge!({
        name: @attrs[:name],
        url: @attrs[:url],
        facebook_url: @attrs[:facebook_url],
        twitter_url: @attrs[:twitter_url],
        github_url: @attrs[:github_url],
        tagline: @attrs[:tagline],
        description: @attrs[:description]
      })
    end

    def check_for_category_update
      category_uuid = @attrs[:category_uuid]

      if @addon.addon_category.try(:uuid) != category_uuid
        addon_category = AddonCategory.find_by(uuid: category_uuid)
        raise "No AddonCategory with uuid: #{category_uuid}" if addon_category.nil?
        @updates[:addon_category_id] = addon_category.id
      end
    end

    def update_icon
      file = @attrs[:icon]

      if @addon.icon != file && file.present?
        # 'file' is a base64 string at this point.
        file_type = base_64_file_type(file)
        valid_file_types = @addon.valid_icon_file_types

        if !valid_file_types.include?(file_type)
          raise "Invalid File Type, #{file_type}. Allowed Types Are #{valid_file_types.join(', ')}."
        end

        file_path = "images/addons/#{@addon.slug}.#{@addon.ext_for_file_type(file_type)}"
        @updates[:icon] = "#{ENV['S3_URL']}/#{file_path}"

        FileServices::CloudUploadService.new(
          @executor_user,
          file,
          file_path,
          file_type
        ).perform
      end
    end

    def update_plans
      formatted_plans, @id_to_plan_slug_map = format_plans(@attrs[:plans])
      @updates[:plans] = formatted_plans
    end

    def update_features
      (@attrs[:features] || []).each { |feature|
        # Make sure index is a string
        feature['index'] = feature['index'].to_s if feature.has_key?('index')

        # Replace the values map with the correct plan slugs
        new_values = {}

        (feature['values'] || {}).each { |id, value|
          new_values[@id_to_plan_slug_map[id]] = value
        }

        feature['values'] = new_values
      }

      validate_addon_json_column(FeaturesTest, @attrs[:features])
      @updates[:features] = @attrs[:features]
    end

    def update_jobs
      jobs_for_db, file_jobs = format_jobs(@attrs[:jobs], @addon.slug)
      @updates[:jobs] = jobs_for_db

      file_jobs.each { |job|
        FileServices::CloudUploadService.new(
          @executor_user,
          job[:file],
          job[:contents],
          base_64_file_type(job[:file])
        ).delay.perform
      }
    end

    def update_configs
      validate_addon_json_column(ConfigsTest, { 'configs' => @attrs[:configs], 'addon_slug' => @addon.slug })
      @updates[:configs] = @attrs[:configs]
    end

    def update_api
      api = @addon.api || {}
      api['production'] = @attrs[:api]

      validate_addon_json_column(ServiceApiTest, api)
      @updates[:api] = api
    end

  end
end