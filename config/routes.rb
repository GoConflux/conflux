Rails.application.routes.draw do


  # HOME ------------------------------------

    # User:
    get '/' => 'home#index'


  # KEYS ------------------------------------

    # User:
    post '/keys' => 'keys#create'
    put '/keys' => 'keys#update'
    delete '/keys' => 'keys#destroy'

    # API:
    get '/api/keys' => 'keys_api#index'
    post '/api/remove_keys' => 'keys_api#remove_keys_from_redis'

  # LOGIN -----------------------------------

    # User:
    get '/login' => 'login#index'
    get '/signup' => 'login#signup'
    get '/signout' => 'login#signout'
    post '/login' => 'login#login'


  # APP_ADDONS ------------------------------

    # User:
    post '/app_addons' => 'app_addons#create'
    put '/app_addons/update_plan' => 'app_addons#update_plan'
    put '/app_addons/update_description' => 'app_addons#update_description'
    delete '/app_addons' => 'app_addons#destroy'

    # API:
    post '/api/app_addons' => 'app_addons_api#create'
    delete '/api/app_addons' => 'app_addons_api#destroy'

  # ADDONS ----------------------------------

    # User:
    get '/addons/search' => 'addons#search'
    get '/addons/modal_info' => 'addons#modal_info'
    get '/addons/:addon_slug' => 'addons#addon'
    get '/addons' => 'addons#index'

    # API:
    get '/api/addons/for_app' => 'addons_api#for_app'
    get '/api/addons/all' => 'addons_api#all'
    get '/api/addons/plans' => 'addons_api#plans'


  # APPS ------------------------------------

    # User:
    get '/apps/name_available' => 'apps#name_available'
    post '/apps' => 'apps#create'
    put '/apps' => 'apps#update'
    delete '/apps' => 'apps#destroy'

    # API:
    get '/api/apps/manifest' => 'apps_api#manifest'
    get '/api/apps/cost' => 'apps_api#cost'
    get '/api/pull' => 'apps_api#pull'


  # PIPELINES -------------------------------

    # User:
    get '/pipelines/name_available' => 'pipelines#name_available'
    post '/pipelines' => 'pipelines#create'
    put '/pipelines' => 'pipelines#update'
    delete '/pipelines' => 'pipelines#destroy'


  # TEAMS -----------------------------------

    # User:
    get '/teams/name_available' => 'teams#name_available'
    post '/teams' => 'teams#create'

    # API:
    get '/api/teams/users' => 'teams_api#users'


  # TEAM_USERS ------------------------------

    # User:
    post '/team_users/invite' => 'team_users#invite'

    # API:
    post '/api/team_users/invite' => 'team_users_api#invite'


  # USERS -----------------------------------

    # API:
    post '/api/users/login' => 'users_api#login'
    get '/api/users/apps' => 'users_api#apps'
    post '/api/users/apps_basic_auth' => 'users_api#apps_basic_auth'
    get '/api/users/teams' => 'users_api#teams'

  # MAJOR VIEWS -----------------------------

    # User:
    get '/:team_slug/users' => 'teams#users'
    get '/:team_slug/:pipeline_slug/:app_slug/:addon_slug' => 'app_addons#index'
    get '/:team_slug/:pipeline_slug/:app_slug' => 'apps#index'
    get '/:team_slug/:pipeline_slug' => 'pipelines#index'
    get '/:team_slug' => 'teams#index'


  # 404 -------------------------------------
  get '*unmatched_route', to: 'application#page_dne'

end