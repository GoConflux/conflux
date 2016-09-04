class PygmentedMarkdown < Redcarpet::Render::HTML
  require 'redcarpet'
  require 'pygments.rb'

  def block_code(code, language)
    Pygments.highlight(code, lexer: language)
  end

end