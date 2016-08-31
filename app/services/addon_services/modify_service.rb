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

      # ** PLANS AND FEATURES DATA MIGHT HAVE TO BE BUNCHED TOGETHER

      # Update pricing plans.
      update_plans

      # Update list of features for each plan.
      update_features

      # Update addon-specific jobs to be run post-addon-provisioning.
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

    # I considered delaying this...but decided not to. If you do delay it, move the file format
    # checks outside of the service and into here.
    def update_icon
      UploadIconService.new(
        @executor_user,
        @addon,
        @attrs[:icon]
      ).perform
    end

    def update_plans
      formatted_plans = format_plans(@attrs[:plans])
      @addon.update_attributes(plans: formatted_plans)
    end

    def update_features
      formatted_features = format_features(@attrs[:features])
      @addon.update_attributes(features: formatted_features)
    end

    def update_jobs
      formatted_jobs = format_jobs(@attrs[:jobs])
      @addon.update_attributes(jobs: formatted_jobs)
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