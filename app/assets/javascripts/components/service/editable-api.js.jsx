var EditableApi = React.createClass({

  setBaseUrlRef: function (ref) {
    this.baseUrl = ref;
  },

  setSsoUrlRef: function (ref) {
    this.ssoUrl = ref;
  },

  serialize: function (cb) {
    var valid = true;
    var baseUrlInfo = this.baseUrl.serialize();
    var ssoUrlInfo = this.ssoUrl.serialize();

    if (this.props.required && !baseUrlInfo.valid || !ssoUrlInfo.valid) {
      valid = false;
    }

    var data = {
      valid: valid,
      value: {
        base_url: baseUrlInfo.value,
        sso_url: ssoUrlInfo.value
      }
    };

    if (!cb) {
      return data;
    }

    cb(data);
  },

  defaultBaseUrl: function () {
    return {
      defaultValue: this.props.data.api.base_url
    }
  },

  defaultSsoUrl: function () {
    return {
      defaultValue: this.props.data.api.sso_url
    }
  },
  
  render: function() {
    return (
      <div className="editable-api">
        <div className="editable-api-input">
          <FormInput required={this.props.required} data={this.defaultBaseUrl()} inputTitle={'Base URL'} ref={this.setBaseUrlRef} />
        </div>
        <div className="editable-api-input">
          <FormInput required={this.props.required} data={this.defaultSsoUrl()} inputTitle={'SSO URL'} ref={this.setSsoUrlRef} />
        </div>
      </div>
    );
  }
});