var EditableApi = React.createClass({

  setBaseUrlRef: function (ref) {
    this.baseUrl = ref;
  },

  setSsoUrlRef: function (ref) {
    this.ssoUrl = ref;
  },

  serialize: function () {
    return {
      base_url: this.baseUrl.serialize().value,
      sso_url: this.ssoUrl.serialize().value
    };
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