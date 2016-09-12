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

  render: function() {
    return (
      <div className="editable-api">
        <div className="editable-api-input">
          <FormInput required={this.props.required} data={this.props.data} inputTitle={'Base URL'} ref={this.setBaseUrlRef} />
        </div>
        <div className="editable-api-input">
          <FormInput required={this.props.required} data={this.props.data} inputTitle={'SSO URL'} ref={this.setSsoUrlRef} />
        </div>
      </div>
    );
  }
});