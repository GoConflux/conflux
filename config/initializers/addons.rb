require 'json'
require 'open-uri'

open('http://confluxapp.s3-website-us-west-1.amazonaws.com/files/addons.json') { |io|
  $addons = JSON.parse(io.read)
}

$jobs = {}

$addons.each { |slug, info|
  info['jobs'].each { |job_id, job_info|
    data = job_info.clone
    data['addon'] = slug
    data['id'] = job_id
    $jobs[job_id] = data
  }
}