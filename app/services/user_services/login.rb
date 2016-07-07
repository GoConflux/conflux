module UserServices
  class Login < AbstractService

    attr_reader :token, :user

    def initialize(
      executor_user,
      email,
      password,
      name: nil,
      sign_up: false
    )
      super(executor_user)
      @email = email
      @password = password
      @name = name
      @sign_up = sign_up
    end

    def perform
      @sign_up ? new_user : existing_user

      ut = UserToken.new(user_id: @user.id, token: UUIDTools::UUID.random_create.to_s)
      ut.save!

      @token = ut.token

      self
    end

    def existing_user
      @user = User.find_by(
        email: @email,
        password: @password
      )

      assert(@user, ConfluxErrors::UserNotFound)
    end

    def new_user
      @user = User.find_or_initialize_by(email: @email)

      raise 'User already exists' if @user.persisted?

      @user.assign_attributes(
        password: @password,
        name: @name
      )

      @user.save!
    end

  end
end