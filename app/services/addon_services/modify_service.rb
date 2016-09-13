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
      update_api

      self
    end

    private

    def check_permissions
      @addon_admin = @addon.addon_admins.find_by(user_id: @executor_user.id).nil?
      raise 'Invalid Permissions' if @addon_admin.nil?
    end

    def add_simple_attrs_to_updates
      @updates.merge({
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

      if @addon.addon_category.uuid != category_uuid
        addon_category = AddonCategory.find_by(uuid: category_uuid)
        raise "No AddonCategory with uuid: #{category_uuid}" if addon_category.nil?
        @addon.update_attributes(addon_category_id: addon_category.id)
      end
    end

    def update_icon
      icon_file = ''
      icon_file_ext = ''

      if !['png', 'jpg'].include?(icon_file_ext)
        raise "Invalid File Extension, #{icon_file_ext}. Allowed extensions are png or jpg"
      end

      icon_file_path = "/images/addons/#{@addon.slug}.#{icon_file_ext}"
      icon_url = "#{ENV['CLOUDFRONT_URL']}#{icon_file_path}"

      FileServices::CloudUploadService.new(
        @executor_user,
        icon_file,
        icon_file_path
      ).delay.perform

      @addon.update_attributes(icon: icon_url) if @addon.icon != icon_url
    end

    def update_plans
      formatted_plans = format_plans(@attrs[:plans])
      @addon.update_attributes(plans: formatted_plans)
    end

    def update_features
      validate_addon_json_column(FeaturesTest, @attrs[:features])
      @addon.update_attributes(features: @attrs[:features])
    end

    def update_jobs
      jobs_for_db, jobs_with_files = format_jobs(@attrs[:jobs], @addon.slug)
      @addon.update_attributes(jobs: jobs_for_db)

      jobs_with_files.each { |job_id, job_info|
        if job_info[:action] == 'new_file'
          FileServices::CloudUploadService.new(
            @executor_user,
            job_info[:asset][:file],
            job_info[:asset][:contents]
          ).delay.perform
        end
      }
    end

    def update_configs
      configs_data = { configs: @attrs[:configs], addon_slug: @addon.slug }
      validate_addon_json_column(ConfigsTest, configs_data)
      @addon.update_attributes(configs: @attrs[:configs])
    end

    def update_api
      validate_addon_json_column(ServiceApiTest, @attrs[:api])
      @addon.update_attributes(api: @attrs[:api])
    end

  end
end