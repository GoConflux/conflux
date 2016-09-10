var Api = React.createClass({

  setBaseUrlRef: function (ref) {
    this.baseUrl = ref;
  },

  setSsoUrlRef: function (ref) {
    this.ssoUrl = ref;
  },

  serialize: function () {
    return {
      base_url: this.baseUrl.serialize(),
      sso_url: this.ssoUrl.serialize()
    };
  },

  render: function() {
    return (
      <div id="api">
        <div className="api-input">
          <FormInput required={this.props.required} data={this.props.data} inputTitle={'Base URL'} ref={this.setBaseUrlRef} />
        </div>
        <div className="api-input">
          <FormInput required={this.props.required} data={this.props.data} inputTitle={'SSO URL'} ref={this.setSsoUrlRef} />
        </div>
      </div>
    );
  }
});