module MarkdownHelper
  extend self
  require 'redcarpet'

  def markdown
    @markdown ||= Redcarpet::Markdown.new(PygmentedMarkdown.new({ link_attributes: { rel: 'nofollow', target: '_blank' }, hard_wrap: true, no_images: true }), fenced_code_blocks: true, autolink: true)
  end

  def format(text)
    markdown.render(text || '')
  end

end