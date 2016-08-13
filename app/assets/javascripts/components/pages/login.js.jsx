var Login = React.createClass({

  getInitialState: function () {
    return {
      sign_up: this.props.sign_up
    };
  },

  setEmailRef: function (ref) {
    this.email = ref;
  },

  setNameRef: function (ref) {
    this.name = ref;
  },

  setPasswordRef: function (ref) {
    this.password = ref;
  },

  setConfirmPasswordRef: function (ref) {
    this.confirmPassword = ref;
  },

  setSpinnerRef: function (ref) {
    this.spinner = ref;
  },

  componentDidMount: function () {
    var self = this;

    $('.card-input.required').keyup(function () {
      $(this).removeClass('invalid');
    });

    $('.card-input:last').keyup(function (e) {
      if (e.which == '13') {
        self.onLoginClick();
      }
    });
  },

  validateData: function (data) {
    var valid = true;

    _.each($('.card-input.required'), function (input) {
      if (_.isEmpty($(input).val().trim())) {
        $(input).addClass('invalid');
        valid = false;
      }
    });

    if (this.state.sign_up && (data.password != $(this.confirmPassword).val())) {
      _.each([this.password, this.confirmPassword], function (el) {
        $(el).addClass('invalid');
      });

      valid = false;
    }

    return valid;
  },

  onLoginClick: function () {
    var data = this.state.sign_up ? {
      email: $(this.email).val().trim(),
      password: $(this.password).val().trim(),
      sign_up: true
    } : {
      email: $(this.email).val().trim(),
      password: $(this.password).val().trim()
    };

    if (!this.validateData(data)) {
      return;
    }
    
    this.showSpinner();

    React.post('/login', data, {
      success: function (response, status, xhr) {
        var userToken = xhr.getResponseHeader('Conflux-User');

        if (userToken) {
          React.setCookie('Conflux-User', userToken);
        }

        window.location = response.redirect_url || '/';
      }
    });
  },

  showSpinner: function () {
    $('.primary-text').css('color', 'rgba(0,0,0,0)');
    this.spinner.showSpinner();
  },

  getNameInput: function () {
    return this.state.sign_up ?
      <input type="text" name="name" className="card-input" placeholder="name (optional)" ref={this.setNameRef}/> : null;
  },

  getConfirmPassword: function () {
    return this.state.sign_up ?
      <input type="password" name="confirm-password" className="card-input required" placeholder="confirm password" ref={this.setConfirmPasswordRef}/> : null;
  },

  getTitleText: function () {
    return this.state.sign_up ? 'Sign up for Conflux' : 'Sign in to Conflux';
  },

  getSubtitle: function () {
    return this.state.sign_up ? null : <div className="subtitle">Enter your email and password.</div>;
  },

  getFooterButtons: function () {
    var btnInfo = this.state.sign_up ? [] : [
      {
        link: '/signup',
        text: 'No account yet? Sign up.'
      },
      {
        link: 'javascript:void(0)',
        text: 'I forgot my password',
        onClick: this.forgotPassword
      }
    ];

    return btnInfo.map(function (info) {
      return <div className="card-footer-button"><a href={info.link} onClick={(info.onClick || function(){})} className="card-footer-link">{info.text}</a></div>;
    });
  },

  getPrimaryBtnText: function () {
    return this.state.sign_up ? <span className="primary-text">Sign up</span> : <span className="primary-text">Sign in</span>;
  },

  forgotPassword: function () {
    React.modal.show('password:forgot');
  },

  getTitleClasses: function () {
    var classes = 'title';

    if (this.state.sign_up) {
      classes += ' sign-up';
    }

    return classes;
  },

  render: function() {
    return (
      <div id="login">
        <div className="card">
          <div className={this.getTitleClasses()}>{this.getTitleText()}</div>
          {this.getSubtitle()}
          <div className="card-body">
            <input type="text" name="email" className="card-input required" placeholder="email" ref={this.setEmailRef}/>
            <input type="password" name="password" className="card-input required" placeholder="password" ref={this.setPasswordRef}/>
            {this.getConfirmPassword()}
            <a className="primary-action-btn" onClick={this.onLoginClick} href="javascript:void(0)">
              {this.getPrimaryBtnText()}
              <HorizontalSpinner ref={this.setSpinnerRef} />
            </a>
          </div>
          <div className="card-footer">
            {this.getFooterButtons()}
          </div>
        </div>
      </div>
    );
  }
});