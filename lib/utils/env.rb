module Utils
  module Env

    def self.is_enabled?(key)
      ENV[key.to_s].match(/true/i) != nil
    end

  end
end
