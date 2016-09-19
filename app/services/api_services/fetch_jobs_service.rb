module ApiServices
  class FetchJobsService < AbstractService
    include ApplicationHelper

    attr_reader :jobs

    def initialize(executor_user, app, app_token, past_jobs, team_user)
      super(executor_user)
      @app = app
      @app_token = app_token # was used when redis was being used
      @past_jobs = past_jobs
      @team_user = team_user
      @jobs = {}
    end

    def perform
      # We have a @past_jobs array of past job ids.
      # We needs to fill the @jobs hash with any NEW jobs, sorted by addon.
      # Example of @jobs structure:

      # {
      #   'pubnub' => [new pubnub jobs],
      #   'bucketeer' => [new bucketeer jobs],
      #   'etc...'
      # }

      # ...where a job has the structure:

      # {
      #   "id": "7de945",
      #   "action": "new_library",
      #   "asset": {
      #     "lang": "ruby",
      #     "name": "pubnub",
      #     "version": "3.6.10"
      #   }
      # }

      @app.app_addons
        .includes(:app_scope, :addon)
        .where(app_scopes: { team_user_id: [nil, @team_user.id] })
        .each { |app_addon|
          addon = app_addon.addon
          addon_jobs = addon.jobs
          addon_job_ids = addon_jobs.keys

          (addon_job_ids - @past_jobs).each { |job_id|
            job = addon_jobs[job_id]
            job['id'] = job_id
            @jobs[addon.slug] = [] unless @jobs.has_key?(addon.slug)
            @jobs[addon.slug].push(job)
          }
        }

      self
    end
  end
end