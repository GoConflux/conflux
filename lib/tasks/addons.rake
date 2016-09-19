require 'json'
require 'platform-api'
require 'open-uri'

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
        icon: "#{ENV['CLOUDFRONT_URL']}/images/addons/aws-redis.svg",
        heroku_alias: 'heroku-redis'
      )
    end

    if heroku_pg.present?
      heroku_pg.update_attributes(
        slug: 'aws-pg',
        name: 'AWS Postgres',
        icon: "#{ENV['CLOUDFRONT_URL']}/images/addons/aws-pg.svg",
        tagline: 'Reliable and powerful PostgreSQL as a service.',
        heroku_alias: 'heroku-postgresql'
      )
    end
  end

  desc 'Importing addons.json data into their respective Postgres addon records'
  task :migrate_addons_json => :environment do
    addons_json = nil

    open("#{ENV['S3_URL']}/files/addons.json") { |io|
      addons_json = JSON.parse(io.read) rescue {}
    }

    addons_json.each { |slug, info|
      addon = Addon.unscoped.find_by(slug: slug, is_destroyed: false)
      next if addon.nil?

      # STATUS
      updates = {
        status: Addon::Status::ACTIVE,
        jobs: info['jobs']
      }

      # CONFIGS
      updates[:configs] = info['configs'].map { |name|
        {
          name: name,
          description: ''
        }
      }

      # PLANS
      updates[:plans] = info['plans'].map { |plan|
        data = {
          slug: plan['slug'],
          name: plan['name'],
          price: plan['price']
        }

        data[:disabled] = true if plan['disabled'] === 'true'

        data
      }

      addon.update_attributes(updates)
    }
  end

  desc 'Manually adding urls to addon records for first set of addons'
  task :add_urls => :environment do
    url_map = {
      'blitline' => 'https://www.blitline.com',
      'mongolab' => 'https://www.mlab.com',
      'pubnub' => 'https://www.pubnub.com',
      'redistogo' => 'https://www.redistogo.com',
      'sendgrid' => 'https://www.sendgrid.com',
      'stream' => 'https://www.getstream.io',
      'websolr' => 'https://www.websolr.com',
    }

    Addon.all.each { |addon|
      if url_map.key?(addon.slug)
        addon.update_attributes(url: url_map[addon.slug])
      end
    }
  end

  desc 'Set Ben Whittle as owner of all heroku_dependent addons'
  task :give_heroku_addons_an_owner => :environment do
    user = User.find_by(email: 'benwhittle31@gmail.com')

    Addon.where(heroku_dependent: true).each { |addon|
      AddonAdmin.create!(
        addon_id: addon.id,
        user_id: user.id,
        is_owner: true
      )
    }
  end

  desc 'Add uuid\'s to addon_categories without them'
  task :add_uuids_to_addon_categories => :environment do
    AddonCategory.all.each { |ac|
      if ac.uuid.nil?
        ac.update_attributes(uuid: UUIDTools::UUID.random_create.to_s)
      end
    }
  end

  desc 'Add indexes to features'
  task :add_index_to_features => :environment do
    Addon.unscoped.where(is_destroyed: false).each { |addon|
      features = addon.features.clone || []

      features.each_with_index { |feature, i|
        feature['index'] = i
      }

      addon.update_attributes(features: features)
    }
  end

  desc 'transfer features from Heroku'
  task :transfer_heroku_features => :environment do
    Addon.all.each { |addon|
      addon_features_file = File.join(Rails.root, 'features-json', "#{addon.slug}.json")

      if File.exists?(addon_features_file)
        begin
          ActiveRecord::Base.transaction do
            features = JSON.parse(File.read(addon_features_file))

            features.each_with_index { |feature, i|
              feature['index'] = i.to_s
            }

            addon.update_attributes(features: features)
          end
        rescue Exception => e
          puts "Error copying features over for #{addon.slug}: #{e.message}"
        end
      end
    }
  end

  desc 'reformat existing job contents urls'
  task :reformat_job_contents_urls => :environment do
    ActiveRecord::Base.transaction do
      Addon.all.each { |addon|
        new_jobs = {}

        (addon.jobs || {}).each { |job_id, data|
          if data['action'] == Addon::JobTypes::NEW_FILE
            data['asset']['contents'] = "files/addons/#{addon.slug}/#{job_id}"
          end

          new_jobs[job_id] = data
        }

        addon.update_attributes(jobs: new_jobs)
      }
    end
  end

  desc 'Convert icon urls to use S3 instead of Cloudfront since they can get updated often'
  task :service_icons_to_s3 => :environment do
    ActiveRecord::Base.transaction do
      Addon.all.each { |addon|
        addon.update_attributes(icon: addon.icon.gsub(ENV['CLOUDFRONT_URL'], ENV['S3_URL']))
      }
    end
  end

end