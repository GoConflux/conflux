module AddonServices
  class PGTransfer < DataTransferService

    def initialize(executor_user, source_url, target_url)
      super(executor_user, source_url, target_url)
    end

    def perform
      ensure_target_pg_db_empty
      system dump_restore_cmd
      self
    end

    private

    def ensure_target_pg_db_empty
      sql = 'select count(*) = 0 from pg_stat_user_tables;'
      result = exec_sql_on_pg_uri(sql, @target)

      if result != " ?column? \n----------\n t\n(1 row)\n\n"
        raise 'Target database is not empty.'
      end
    end

    def exec_sql_on_pg_uri(sql, uri)
      begin
        app_name = "psql #{`whoami`.chomp.gsub(/\W/,'')} non-interactive"
        user_section = uri.user ? "-U #{uri.user}" : ''
        output = `env PGPASSWORD=#{uri.password} PGSSLMODE=require PGAPPNAME=#{app_name} psql -c "#{sql}" #{user_section} -h #{uri.host} -p #{uri.port || 5432} #{uri.path[1..-1]}`

        if !$?.success? || output.nil? || output.empty?
          raise "psql failed. exit status #{$?.to_i}, output: #{output.inspect}"
        end

        output
      rescue Exception => e
        raise "Error executing SQL on URI for data transfer: #{e.message}"
      end
    end

    def dump_restore_cmd
      pg_restore = pg_restore_command(@target)
      pg_dump = pg_dump_command(@source)
      "#{pg_dump} | #{pg_restore}"
    end

    def pg_dump_command(uri)
      # It is occasionally necessary to override PGSSLMODE, as when the server wasn't built to support SSL.
      %{ env PGPASSWORD=#{uri.password} PGSSLMODE=prefer pg_dump --verbose -F c -Z 0 #{connstring(uri, :skip_d_flag)} }
    end

    def pg_restore_command(uri)
      %{ env PGPASSWORD=#{uri.password} pg_restore --verbose --no-acl --no-owner #{connstring(uri)} }
    end

    def connstring(uri, skip_d_flag = false)
      database = uri.path[1..-1]
      user = uri.user ? "-U #{uri.user}" : ''
      %Q{#{user} -h #{uri.host} -p #{uri.port} #{skip_d_flag ? '' : '-d'} #{database} }
    end

  end
end