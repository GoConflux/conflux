namespace :apps do

  desc 'Seed new app_scopes for existing "shared" apps.'
  task :seed_app_scopes => :environment do
    App.all.each { |app|
      app_scope = AppScope.new(
        app_id: app.id,
        scope: AppScope::SHARED,
        heroku_app: app.heroku_app
      )

      app_scope.save!

      AppAddon.where(app_scope_id: app.id).update_all(app_scope_id: app_scope.id)
    }
  end

end