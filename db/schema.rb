# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160903025739) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addon_admins", force: :cascade do |t|
    t.integer  "addon_id"
    t.integer  "user_id"
    t.boolean  "is_owner",     default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_destroyed", default: false
  end

  add_index "addon_admins", ["addon_id", "user_id"], name: "index_addon_admins_on_addon_id_and_user_id", using: :btree

  create_table "addon_categories", force: :cascade do |t|
    t.string "category"
    t.string "uuid"
  end

  add_index "addon_categories", ["category"], name: "index_addon_categories_on_category", using: :btree

  create_table "addon_likes", force: :cascade do |t|
    t.integer "addon_id"
    t.integer "user_id"
  end

  create_table "addons", force: :cascade do |t|
    t.string   "uuid"
    t.string   "name"
    t.text     "description"
    t.string   "icon"
    t.string   "slug"
    t.boolean  "is_destroyed",        default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "heroku_dependent",    default: false
    t.string   "tagline"
    t.string   "category"
    t.integer  "addon_category_id"
    t.boolean  "prevent_deprovision", default: false
    t.string   "heroku_alias"
    t.integer  "status",              default: -1
    t.string   "url"
    t.string   "password"
    t.string   "sso_salt"
    t.json     "configs",             default: []
    t.json     "plans",               default: []
    t.json     "features",            default: []
    t.json     "jobs",                default: {}
    t.json     "api",                 default: {}
    t.string   "facebook_url"
    t.string   "twitter_url"
    t.string   "github_url"
  end

  add_index "addons", ["is_destroyed"], name: "index_addons_on_is_destroyed", using: :btree
  add_index "addons", ["slug"], name: "index_addons_on_slug", using: :btree
  add_index "addons", ["uuid"], name: "index_addons_on_uuid", using: :btree

  create_table "app_addons", force: :cascade do |t|
    t.string   "uuid"
    t.integer  "app_scope_id"
    t.integer  "addon_id"
    t.text     "description"
    t.boolean  "is_destroyed",      default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "plan"
    t.string   "external_uuid"
    t.string   "external_username"
  end

  add_index "app_addons", ["app_scope_id", "addon_id"], name: "index_app_addons_on_app_scope_id_and_addon_id", using: :btree
  add_index "app_addons", ["is_destroyed"], name: "index_app_addons_on_is_destroyed", using: :btree
  add_index "app_addons", ["uuid"], name: "index_app_addons_on_uuid", using: :btree

  create_table "app_scopes", force: :cascade do |t|
    t.integer  "app_id"
    t.integer  "scope"
    t.integer  "team_user_id"
    t.string   "heroku_app"
    t.boolean  "is_destroyed", default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "app_scopes", ["app_id"], name: "index_app_scopes_on_app_id", using: :btree
  add_index "app_scopes", ["is_destroyed"], name: "index_app_scopes_on_is_destroyed", using: :btree
  add_index "app_scopes", ["scope"], name: "index_app_scopes_on_scope", using: :btree
  add_index "app_scopes", ["team_user_id"], name: "index_app_scopes_on_team_user_id", using: :btree

  create_table "apps", force: :cascade do |t|
    t.string   "uuid"
    t.string   "name"
    t.string   "slug"
    t.text     "description"
    t.boolean  "is_destroyed", default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "token"
    t.integer  "tier_id"
    t.string   "heroku_app"
  end

  add_index "apps", ["is_destroyed"], name: "index_apps_on_is_destroyed", using: :btree
  add_index "apps", ["slug"], name: "index_apps_on_slug", using: :btree
  add_index "apps", ["uuid"], name: "index_apps_on_uuid", using: :btree

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "keys", force: :cascade do |t|
    t.string   "uuid"
    t.text     "name"
    t.text     "value"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "app_addon_id"
  end

  add_index "keys", ["name"], name: "index_keys_on_name", using: :btree
  add_index "keys", ["uuid"], name: "index_keys_on_uuid", using: :btree

  create_table "pipelines", force: :cascade do |t|
    t.string   "uuid"
    t.string   "name"
    t.text     "description"
    t.string   "slug"
    t.boolean  "is_destroyed", default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "team_id"
  end

  add_index "pipelines", ["is_destroyed"], name: "index_pipelines_on_is_destroyed", using: :btree
  add_index "pipelines", ["slug"], name: "index_pipelines_on_slug", using: :btree
  add_index "pipelines", ["uuid"], name: "index_pipelines_on_uuid", using: :btree

  create_table "team_user_tokens", force: :cascade do |t|
    t.integer  "team_user_id"
    t.string   "token"
    t.boolean  "expired",      default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "team_user_tokens", ["token"], name: "index_team_user_tokens_on_token", using: :btree

  create_table "team_users", force: :cascade do |t|
    t.string   "uuid"
    t.integer  "team_id"
    t.integer  "user_id"
    t.boolean  "is_destroyed", default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "role"
  end

  add_index "team_users", ["is_destroyed"], name: "index_team_users_on_is_destroyed", using: :btree
  add_index "team_users", ["team_id", "user_id"], name: "index_team_users_on_team_id_and_user_id", unique: true, using: :btree
  add_index "team_users", ["uuid"], name: "index_team_users_on_uuid", using: :btree

  create_table "teams", force: :cascade do |t|
    t.string   "uuid"
    t.string   "name"
    t.string   "slug"
    t.boolean  "is_destroyed", default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "icon"
  end

  add_index "teams", ["is_destroyed"], name: "index_teams_on_is_destroyed", using: :btree
  add_index "teams", ["slug"], name: "index_teams_on_slug", using: :btree
  add_index "teams", ["uuid"], name: "index_teams_on_uuid", using: :btree

  create_table "tiers", force: :cascade do |t|
    t.string   "uuid"
    t.string   "name"
    t.integer  "stage"
    t.boolean  "is_destroyed", default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "pipeline_id"
  end

  add_index "tiers", ["is_destroyed"], name: "index_tiers_on_is_destroyed", using: :btree
  add_index "tiers", ["uuid"], name: "index_tiers_on_uuid", using: :btree

  create_table "user_tokens", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "token"
    t.boolean  "expired",    default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_tokens", ["token"], name: "index_user_tokens_on_token", using: :btree
  add_index "user_tokens", ["user_id"], name: "index_user_tokens_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "uuid"
    t.string   "name"
    t.string   "email"
    t.string   "password"
    t.string   "pic"
    t.boolean  "is_destroyed",              default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "can_access_non_free_plans", default: false
  end

  add_index "users", ["email"], name: "index_users_on_email", using: :btree
  add_index "users", ["is_destroyed"], name: "index_users_on_is_destroyed", using: :btree
  add_index "users", ["uuid"], name: "index_users_on_uuid", using: :btree

end
