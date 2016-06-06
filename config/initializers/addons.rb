require 'json'

$addons = JSON.parse(File.read(File.join(Rails.root, 'config', 'addons.json')))

$jobs = {}

$addons.each { |slug, info|
  info['jobs'].each { |job_id, job_info|
    data = job_info.clone
    data['addon'] = slug
    data['id'] = job_id
    $jobs[job_id] = data
  }
}