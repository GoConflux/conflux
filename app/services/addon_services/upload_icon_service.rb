module AddonServices
  class UploadIconService < AbstractService

    def initialize(executor_user, addon, icon)
      super(executor_user)
      @icon = icon
    end

    def perform
      # Ensure @executor_user is an addon_admin for this addon.
      icon_extension = '' # figure out this shit (either png or jpg)

      if !['png', 'jpg'].include?(icon_extension)
        raise 'Invalid Icon File Type: icon must be either .png or .jpg'
      end

      icon_file_name = "#{@addon.slug}.#{icon_extension}"

      # Upload that shit

      icon_url = "#{ENV['CLOUDFRONT_URL']}/images/addons/#{icon_file_name}"

      @addon.update_attributes(icon: icon_url) if @addon.icon != icon_url

      self
    end

  end
end