module ApiServices
  class FetchJobsService < AbstractService
    include ApplicationHelper

    attr_reader :jobs

    def initialize(executor_user, app, app_token, past_jobs)
      super(executor_user)
      @app = app
      @app_token = app_token
      @past_jobs = past_jobs
      @jobs = {}
    end

    def perform
      job_ids = $redis.hget(Key::JOBS, @app_token) if $redis.present?
      add_to_redis = false

      if job_ids.present?
        job_ids = JSON.parse(job_ids) rescue []
      else
        job_ids = @app.job_ids
        add_to_redis = true
      end

      if add_to_redis && $redis.present?
        $redis.hset(Key::JOBS, @app_token, job_ids.to_json)
      end

      (job_ids - @past_jobs).each { |job_id|
        job_info = $jobs[job_id]
        addon = job_info['addon']

        @jobs[addon] = [] if !@jobs.key?(addon)

        @jobs[addon].push(job_info)
      }

      self
    end
  end
end