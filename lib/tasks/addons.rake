require 'json'
require 'platform-api'

namespace :addons do

  desc 'Add a Heroku addon to your addons.json'
  task :add_heroku_addon, [:slug] => [:environment] do |t, args|
    addon_slug = args[:slug]

    @addon = Addon.find_or_initialize_by(slug: addon_slug)

    @addon.assign_attributes(heroku_dependent: true)

    addons_json_file = File.join(Rails.root, 'config', 'addons.json')

    addons_json = JSON.parse(File.read(addons_json_file))

    fetch_plans_and_save_addon = lambda {
      heroku = PlatformAPI.connect_oauth(ENV['HEROKU_API_TOKEN'])

      resp = heroku.plan.list(addon_slug)

      raise 'Heroku response was empty...' if resp.blank?

      @plans = resp.sort_by { |plan| plan['price']['cents'] }

      @addon_name = @plans.first['addon_service']['name']

      @addon.assign_attributes(name: @addon_name)

      @addon.save!
    }

    # If addon already exists in addons.json, don't rewrite it
    if addons_json.key?(addon_slug)
      # But before returning, if the addon record doesn't exist in the DB yet,
      # go ahead and fetch the name of the addon, assign that, then save to the DB
      fetch_plans_and_save_addon.call if !@addon.persisted?
    else
      fetch_plans_and_save_addon.call

      new_addon_json = {}

      new_addon_json['plans'] = @plans.map { |plan|
        cents = plan['price']['cents']

        {
          'slug' => plan['name'].gsub("#{addon_slug}:", ''),
          'name' => plan['human_name'],
          'displayPrice' => cents == 0 ? 'Free' : "$#{(cents / 100)}/mo",
          'price' => (cents / 100).to_f.to_s
        }
      }

      new_addon_json['configs'] = new_addon_json['headlineFeatures'] = []

      new_addon_json['jobs'] = {}

      addons_json[addon_slug] = new_addon_json

      File.open(addons_json_file, 'w+') do |f|
        f.write(JSON.pretty_generate(addons_json))
      end

    end

    puts "Successfully added support for Heroku addon #{@addon_name || addon_slug}"
  end

  desc 'Renaming heroku-redis and heroku-postgresql to aws-redis and aws-pg, respectively.'
  task :rename_heroku_addons => :environment do
    heroku_redis = Addon.find_by(slug: 'heroku-redis')
    heroku_pg = Addon.find_by(slug: 'heroku-postgresql')

    if heroku_redis.present?
      heroku_redis.update_attributes(
        slug: 'aws-redis',
        name: 'AWS Redis',
        icon: 'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/addons/aws-redis.svg',
        heroku_alias: 'heroku-redis'
      )
    end

    if heroku_pg.present?
      heroku_pg.update_attributes(
        slug: 'aws-pg',
        name: 'AWS Postgres',
        icon: 'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/addons/aws-pg.svg',
        tagline: 'Reliable and powerful PostgreSQL as a service.',
        heroku_alias: 'heroku-postgresql'
      )
    end
  end

end