class AbstractJsonTest
  attr_accessor :data
  attr_reader :err_message

  def initialize(data)
    @data = data
  end

  def test(msg, &block)
    raise msg unless block.call
  end

  def call
    begin
      call!
      true
    rescue Exception => e
      @err_message = e.message
      false
    end
  end

  def call!
    raise 'You must implement \'call!\' within your child class first.'
  end

end