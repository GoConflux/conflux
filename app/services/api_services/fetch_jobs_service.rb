module ApiServices
  class FetchJobsService < AbstractService
    include ApplicationHelper

    attr_reader :jobs

    def initialize(executor_user, app, app_token, past_jobs, team_user)
      super(executor_user)
      @app = app
      @app_token = app_token
      @past_jobs = past_jobs
      @team_user = team_user
      @jobs = {}
    end

    def perform
      # # attempt to get the array of job ids from redis if redis exists
      # job_ids = $redis.hget(Key::JOBS, @app_token) if $redis.present?
      # add_to_redis = false
      #
      # # if the job ids fetched from redis do NOT come back nil, take what is given and parse it.
      # if job_ids.present?
      #   job_ids = JSON.parse(job_ids) rescue []
      #
      # # app_token wasn't inside redis, so get all job ids that belong to this app
      # else
      #   job_ids = @app.job_ids
      #   add_to_redis = true
      # end
      #
      # # if app_token wasn't in redis, store the fetched job_ids from above under that app_token
      # if add_to_redis && $redis.present?
      #   $redis.hset(Key::JOBS, @app_token, job_ids.to_json)
      # end

      job_ids = @app.job_ids(@team_user.id)

      (job_ids - @past_jobs).each { |job_id|
        job_info = $jobs[job_id] # global var '$jobs' -- important difference

        if job_info
          addon = job_info['addon']

          @jobs[addon] = [] if !@jobs.key?(addon)

          @jobs[addon].push(job_info)
        end
      }

      self
    end
  end
end