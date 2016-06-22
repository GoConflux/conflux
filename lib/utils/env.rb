module Utils
  module Env

    def self.is_enabled?(key)
      key = key.to_s
      ENV.key?(key) && ENV[key].match(/true/i) != nil
    end

  end
end
