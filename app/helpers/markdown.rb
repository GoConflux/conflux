module Markdown
  extend self
  require 'redcarpet'

  def render(text)
    @@markdown ||= Redcarpet::Markdown.new(PygmentedMarkdown.new({ link_attributes: { rel: 'nofollow', target: '_blank' }, hard_wrap: true, no_images: true }), fenced_code_blocks: true, autolink: true)
    @@markdown.render(text || '')
  end
end