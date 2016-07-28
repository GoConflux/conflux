module AppsHelper

  def addons_for_app_view
    result = { personal: [], shared: [] }

    @app.app_addons
      .includes(:app_scope, :addon)
      .where(app_scopes: { team_user_id: [nil, @current_team_user.try(:id)] })
      .each { |app_addon|
        addon = app_addon.addon

        data = {
          name: addon.name,
          icon: addon.icon,
          tagline: addon.tagline,
          link: app_addon.create_link,
          addon_uuid: addon.uuid
        }

        case app_addon.app_scope.scope
          when AppScope::SHARED
            result[:shared].push(data)
          when AppScope::PERSONAL
            result[:personal].push(data)
        end
     }

    result
  end

  def personal_app_scope
    AppScope.find_or_create_by(
      app_id: @app.id,
      scope: AppScope::PERSONAL,
      team_user_id: @current_team_user.id
    )
  end

  def create_new_app(attrs)
    app = App.new(attrs)
    app.save!
    app_scope = AppScope.new(app_id: app.id, scope: AppScope::SHARED)
    app_scope.save!
    [app, app_scope]
  end

end