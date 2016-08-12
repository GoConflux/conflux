module AddonServices
  class RedisTransfer < DataTransferService

    def initialize(executor_user, source_url, target_url)
      super(executor_user, source_url, target_url)
    end

    def perform


      self
    end

    def ensure_target_pg_db_empty
      sql = 'select count(*) = 0 from pg_stat_user_tables;'
      result = exec_sql_on_pg_uri(sql, @target)

      if result != " ?column? \n----------\n t\n(1 row)\n\n"
        raise 'Target database is not empty.'
      end
    end

  end
end