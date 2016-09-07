var EditService = React.createClass({

  setNameRef: function (ref) {
    this.name = ref;
  },

  setUrlRef: function (ref) {
    this.url = ref;
  },

  setFacebookUrlRef: function (ref) {
    this.facebookUrl = ref;
  },

  setTwitterUrlRef: function (ref) {
    this.twitterUrl = ref;
  },

  setGithubUrlRef: function (ref) {
    this.githubUrl = ref;
  },

  saveService: function () {
    var payload = this.serialize();

    React.post('/addons/modify', _.extend(payload, { addon_uuid: this.props.addon_uuid }), {
      success: function (data) {
        window.location = data.url;
      }
    });
  },

  inputCompData: function (defaultValue) {
    return {
      type: 'input',
      defaultValue: defaultValue
    };
  },

  serialize: function () {
  },

  render: function() {
    return (
      <div id="service">
        <div className="home-header"></div>
        <div className="edit-service-container conflux-container">
          <div className="edit-service-header">
            <div className="header-text">Edit Service</div>
          </div>
          <div className="edit-service-body">
            <FormSection label={'Name'} required={true} compData={this.inputCompData(this.props.name)} ref={this.setNameRef}/>
            <FormSection label={'Website URL'} required={false} compData={this.inputCompData(this.props.links.url)} ref={this.setUrlRef}/>
            <FormSection label={'Facebook URL'} required={false} compData={this.inputCompData(this.props.links.facebook_url)} ref={this.setFacebookUrlRef}/>
            <FormSection label={'Twitter URL'} required={false} compData={this.inputCompData(this.props.links.twitter_url)} ref={this.setTwitterUrlRef}/>
            <FormSection label={'GitHub URL'} required={false} compData={this.inputCompData(this.props.links.github_url)} ref={this.setGithubUrlRef}/>
          </div>
          <div className="edit-service-footer">
            <div className="save-service-btn" onClick={this.saveService}>Save Service</div>
          </div>
        </div>
      </div>
    );
  }
});