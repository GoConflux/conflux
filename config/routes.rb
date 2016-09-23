Rails.application.routes.draw do

  # HOME ------------------------------------

    # User:
    get '/' => 'home#index'
    get '/services' => 'home#services'
    get '/services/:addon_slug' => 'home#service'
    get '/services/:addon_slug/edit' => 'home#edit_service'
    get '/download' => 'home#download'
    get '/.well-known/acme-challenge/:id' => 'home#lets_encrypt'

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
    get '/reset_password' => 'login#reset_password'
    post '/pw_reset' => 'login#pw_reset'
    post '/forgot_password' => 'login#forgot_password'

  # APP_ADDONS ------------------------------

    # User:
    post '/app_addons' => 'app_addons#create'
    put '/app_addons/update_plan' => 'app_addons#update_plan'
    put '/app_addons/update_description' => 'app_addons#update_description'
    delete '/app_addons' => 'app_addons#destroy'
    get '/sso/:app_addon_uuid' => 'app_addons#sso'

    # API:
    post '/api/app_addons' => 'app_addons_api#create'
    delete '/api/app_addons' => 'app_addons_api#destroy'

  # ADDONS ----------------------------------

    # User:
    get '/addons/search' => 'addons#search'
    get '/addons/modal_info' => 'addons#modal_info'
    get '/addons/admin' => 'addons#admin'
    get '/addons/:addon_slug' => 'addons#addon'
    get '/addons' => 'addons#index'
    post '/addons/md_preview' => 'addons#md_preview'
    post '/addons/suggest' => 'addons#suggest'
    post '/addons/like' => 'addons#like'
    post '/addons/unlike' => 'addons#unlike'
    post '/addons/add_admin' => 'addons#add_admin'
    put '/addons/modify' => 'addons#modify'
    put '/addons/submit' => 'addons#submit'
    put '/addons/approve' => 'addons#approve'
    delete '/addons/remove_admin' => 'addons#remove_admin'

    # API:
    get '/api/addons/for_app' => 'addons_api#for_app'
    get '/api/addons/all' => 'addons_api#all'
    get '/api/addons/plans' => 'addons_api#plans'
    post '/api/addons/push' => 'addons_api#push'

  # APPS ------------------------------------

    # User:
    get '/apps/name_available' => 'apps#name_available'
    get '/apps/clone_info' => 'apps#clone_info'
    post '/apps' => 'apps#create'
    post '/apps/clone' => 'apps#clone'
    put '/apps' => 'apps#update'
    delete '/apps' => 'apps#destroy'

    # API:
    get '/api/apps/manifest' => 'apps_api#manifest'
    get '/api/apps/team_user_app_tokens' => 'apps_api#team_user_app_tokens'
    get '/api/apps/cost' => 'apps_api#cost'
    get '/api/apps/configs' => 'apps_api#configs'
    get '/api/apps/exists' => 'apps_api#exists'
    post '/api/apps/clone' => 'apps_api#clone'
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
    put '/teams' => 'teams#update'
    delete '/teams' => 'teams#destroy'

    # API:
    get '/api/teams/users' => 'teams_api#users'

  # TEAM_USERS ------------------------------

    # User:
    post '/team_users/invite' => 'team_users#invite'
    put '/team_users' => 'team_users#update'
    delete '/team_users' => 'team_users#destroy'

  # API:
    post '/api/team_users/invite' => 'team_users_api#invite'

  # USERS -----------------------------------

    # User:
    post '/users/feedback' => 'users#feedback'
    post '/users/invite_user' => 'users#invite_user'

  # API:
    post '/api/users/login' => 'users_api#login'
    post '/api/users/join' => 'users_api#join'
    get '/api/users/apps' => 'users_api#apps'
    post '/api/users/apps_basic_auth' => 'users_api#apps_basic_auth'
    get '/api/users/teams' => 'users_api#teams'

  # Third Party OAuth -----------------------------

  # User:
    get '/twitter_sign_in' => 'third_party_oauth#twitter_sign_in'
    get '/twitter_oauth' => 'third_party_oauth#twitter_oauth'

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