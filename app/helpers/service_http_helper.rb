require 'rest-client'

module ServiceHttpHelper
  extend self

  def get(url, path, params = {})
    path = "#{path}?" + params.map { |k, v| "#{k}=#{v}" }.join('&') unless params.empty?
    make_request(:get, [], url, path)
  end

  def post(credentials, url, path, payload = nil)
    make_request(:post, credentials, url, path, payload)
  end

  def put(credentials, url, path, payload = nil)
    make_request(:put, credentials, url, path, payload)
  end

  def delete(credentials, url, path, payload = nil)
    make_request(:delete, credentials, url, path, payload)
  end

  def make_request(method, credentials, url, path, payload = nil)
    code = nil
    body = nil

    begin
      args = [ { accept: 'application/json' } ]

      if payload
        args.first[:content_type] = 'application/json'
        args.unshift(payload.to_json)
      end

      user, pass = credentials
      body = RestClient::Resource.new(url, user: user, password: pass, verify_ssl: false)[path].send(
        method,
        *args
      ).to_s

      code = 200
    rescue RestClient::ExceptionWithResponse => e
      code = e.http_code
      body = e.http_body
    rescue Errno::ECONNREFUSED
      code = -1
      body = nil
    end

    if code == 200
      JSON.parse(body) rescue {}
    else
      raise "#{code} error while making service #{method.to_s} to url #{url}#{path}: #{body.inspect}"
    end
  end

end