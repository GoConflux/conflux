class StatusDef
  attr_accessor :name, :code, :message

  def initialize(name, code)
    @name    = name
    @code    = code
    @message = ConfluxErrors.const_get(name)
  end

  def to_s
    @name.to_s
  end
end