var ResetPassword = React.createClass({

  setEmailRef: function (ref) {
    this.email = ref;
  },

  setPasswordRef: function (ref) {
    this.password = ref;
  },

  setNewPasswordRef: function (ref) {
    this.newPassword = ref;
  },

  setConfirmNewPasswordRef: function (ref) {
    this.confirmNewPassword = ref;
  },

  setSpinnerRef: function (ref) {
    this.spinner = ref;
  },

  componentDidMount: function () {
    var self = this;

    $('.card-input.required').keyup(function (e) {
      $(this).removeClass('invalid');

      var name = $(e.target).attr('name');

      if (name == 'new-password') {
        $('[name=confirm-new-password]').removeClass('invalid');
      } else if (name == 'confirm-new-password') {
        $('[name=new-password]').removeClass('invalid');
      }
    });

    $('.card-input:last').keyup(function (e) {
      if (e.which == '13') {
        self.onResetClick();
      }
    });
  },

  onResetClick: function () {
    var data = {
      email: $(this.email).val().trim(),
      password: $(this.password).val().trim(),
      new_password: $(this.newPassword).val().trim()
    };

    if (!this.validateData(data)) {
      return;
    }

    this.showSpinner();

    React.post('/pw_reset', data, {
      success: function (response, status, xhr) {
        var userToken = xhr.getResponseHeader('Conflux-User');

        if (userToken) {
          React.setCookie('Conflux-User', userToken);
        }

        window.location = '/'
      }
    });
  },

  showSpinner: function () {
    $('.primary-text').css('color', 'rgba(0,0,0,0)');
    this.spinner.showSpinner();
  },

  validateData: function (data) {
    var valid = true;

    _.each($('.card-input.required'), function (input) {
      if (_.isEmpty($(input).val().trim())) {
        $(input).addClass('invalid');
        valid = false;
      }
    });

    if (data.new_password != $(this.confirmNewPassword).val().trim()) {
      _.each([this.newPassword, this.confirmNewPassword], function (el) {
        $(el).addClass('invalid');
      });

      valid = false;
    }

    return valid;
  },

  render: function() {
    return (
      <div id="resetPassword">
        <div className="card">
          <div className="title reset">Reset Password</div>
          <div className="card-body">
            <input type="text" name="email" className="card-input required" placeholder="email" ref={this.setEmailRef}/>
            <input type="password" name="current-password" className="card-input required" placeholder="current password" ref={this.setPasswordRef}/>
            <input type="password" name="new-password" className="card-input required" placeholder="new password" ref={this.setNewPasswordRef}/>
            <input type="password" name="confirm-new-password" className="card-input required" placeholder="confirm new password" ref={this.setConfirmNewPasswordRef}/>
            <a className="primary-action-btn" onClick={this.onResetClick} href="javascript:void(0)">
              <span className="primary-text">Reset</span>
              <HorizontalSpinner ref={this.setSpinnerRef} />
            </a>
          </div>
        </div>
      </div>
    );
  }
});