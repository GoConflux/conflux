class AbstractJsonTest
  attr_accessor :data

  def initialize(data)
    @data = data
  end

  def test(msg, &block)
    raise "Test failed: #{msg}" unless block.call
  end

  def call
    begin
      call!
      true
    rescue Exception => e
      puts "Abstract JSON Error: #{e.message}"
      false
    end
  end

  def call!
    raise 'You must implement \'call!\' within your child class first.'
  end

end