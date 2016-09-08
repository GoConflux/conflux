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

  setDescriptionRef: function (ref) {
    this.description = ref;
  },

  setPlanRef: function (ref) {
    this.plans = ref;
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

  descriptionData: function () {
    return {
      type: 'markdown',
      defaultValue: this.props.description
    };
  },

  planData: function (ref) {
    return {
      type: 'form-double-input',
      data: this.props.plans.map(function (plan) {
        return {
          one: plan.name,
          two: parseFloat(plan.price).toFixed(2),
          id: plan.fe_id // front-end id (added on backend)
        };
      }),
      placeholders: ['Plan name', '0.00'],
      extraSecondColClasses: ['dollars'],
      removeButtons: true
    }
  },

  onRemovePlan: function (fePlanId) {
    this.features.removePlan(fePlanId);
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
            <FormSection label={'Short Description'} required={true} description={'This is a description of your project in 50 characters or less for the services page.'} compData={this.inputCompData(this.props.tagline, 50)} ref={this.setTaglineRef}/>
            <FormSection label={'Long Description'} required={true} description={'In greater detail, write a longer description about your service and what it offers.'} compData={this.descriptionData()} ref={this.setDescriptionRef}/>
            <FormSection label={'Plans & Pricing'} required={true} description={'Add the different pricing plans your service will support, in order of increasing price.'} compData={this.planData()} onRemoveRow={this.onRemovePlan} ref={this.setPlanRef}/>
          </div>
          <div className="edit-service-footer">
            <div className="save-service-btn" onClick={this.saveService}>Save Service</div>
          </div>
        </div>
      </div>
    );
  }
});