require 'json'
require 'open-uri'

if ENV['USE_LOCAL_ADDONS']
  $addons = JSON.parse(File.read(File.join(Rails.root, 'config', 'addons.json')))
else
  open("#{ENV['S3_URL']}/files/addons.json") { |io|
    $addons = JSON.parse(io.read)
  }
end

$jobs = {}

$addons.each { |slug, info|
  info['jobs'].each { |job_id, job_info|
    data = job_info.clone
    data['addon'] = slug
    data['id'] = job_id
    $jobs[job_id] = data
  }
}