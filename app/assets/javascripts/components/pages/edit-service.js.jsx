var EditService = React.createClass({

  setNameRef: function (ref) {
    this.name = ref;
  },

  setCategoryRef: function (ref) {
    this.category = ref;
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

  setTaglineRef: function (ref) {
    this.tagline = ref;
  },

  saveService: function () {
    var payload = this.serialize();

    React.post('/addons/modify', _.extend(payload, { addon_uuid: this.props.addon_uuid }), {
      success: function (data) {
        window.location = data.url;
      }
    });
  },

  inputCompData: function (defaultValue, maxLength) {
    var data = {
      type: 'input',
      defaultValue: defaultValue
    };

    if (maxLength) {
      data.maxLength = maxLength.toString();
    }

    return data;
  },
  
  categoryCompData: function () {
    return {
      type: 'select',
      defaultValue: this.props.category_uuid,
      options: this.props.categories
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
            <FormSection label={'Category'} required={true} compData={this.categoryCompData()} ref={this.setCategoryRef}/>
            <FormSection label={'Website URL'} required={false} compData={this.inputCompData(this.props.links.url)} ref={this.setUrlRef}/>
            <FormSection label={'Facebook URL'} required={false} compData={this.inputCompData(this.props.links.facebook_url)} ref={this.setFacebookUrlRef}/>
            <FormSection label={'Twitter URL'} required={false} compData={this.inputCompData(this.props.links.twitter_url)} ref={this.setTwitterUrlRef}/>
            <FormSection label={'GitHub URL'} required={false} compData={this.inputCompData(this.props.links.github_url)} ref={this.setGithubUrlRef}/>
            <FormSection label={'Short Description'} required={true} description={'This is a description of your project in 50 characters or less for the services page'} compData={this.inputCompData(this.props.tagline, 50)} ref={this.setTaglineRef}/>
          </div>
          <div className="edit-service-footer">
            <div className="save-service-btn" onClick={this.saveService}>Save Service</div>
          </div>
        </div>
      </div>
    );
  }
});