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

  setIconRef: function (ref) {
    this.icon = ref;
  },

  setTaglineRef: function (ref) {
    this.tagline = ref;
  },

  setDescriptionRef: function (ref) {
    this.description = ref;
  },

  setPlansRef: function (ref) {
    this.plans = ref;
  },

  setFeaturesRef: function (ref) {
    this.features = ref;
  },

  setConfigsRef: function (ref) {
    this.configs = ref;
  },

  setApiRef: function (ref) {
    this.api = ref;
  },

  setJobsRef: function (ref) {
    this.jobs = ref;
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
  
  categoryData: function () {
    return {
      type: 'select',
      defaultValue: this.props.category_uuid,
      options: this.props.categories
    };
  },

  iconData: function () {
    return {
      type: 'icon',
      icon: this.props.icon
    };
  },

  descriptionData: function () {
    return {
      type: 'markdown',
      defaultValue: this.props.description
    };
  },

  planData: function () {
    return {
      type: 'form-double-input',
      data: this.props.plans.map(function (plan) {
        return {
          one: plan.name,
          two: parseFloat(plan.price).toFixed(2),
          id: plan.id
        };
      }),
      placeholders: ['Plan name', '0.00'],
      extraSecondColClasses: ['dollars'],
      secondDollar: true,
      removeButtons: true,
      newRowName: 'New Plan'
    };
  },
  
  featureData: function () {
    return {
      type: 'editable-features',
      features: this.props.features,
      plans: this.props.plans
    };
  },

  configData: function () {
    return {
      type: 'form-double-input',
      data: this.props.configs.map(function (info) {
        return {
          one: info.name,
          two: info.description
        };
      }),
      placeholders: ['Config Var', 'Description'],
      extraFirstColClasses: ['config-name'],
      extraSecondColClasses: ['config-description'],
      removeButtons: true,
      newRowName: 'New Config Var'
    }
  },

  apiData: function () {
    return {
      type: 'editable-api',
      api: this.props.api
    };
  },

  jobsData: function () {
    return {
      type: 'editable-jobs',
      jobs: this.props.jobs,
      slug: this.props.slug
    }
  },
  
  onRemovePlan: function (id) {
    this.features.comp.removePlan(id);
  },

  onNewPlan: function (id) {
    this.features.comp.addPlan(id);
  },

  formatPlans: function (plans) {
    return _.map(plans, function (data) {
      return {
        id: data.id,
        name: data.one,
        price: data.two
      };
    });
  },

  formatConfigs: function (configs) {
    return _.map(configs, function (data) {
      return {
        name: data.one,
        description: data.two
      };
    });
  },

  serialize: function () {
    var refsMap = {
      name: {
        ref: this.name
      },
      category_uuid: {
        ref: this.category
      },
      url: {
        ref: this.url
      },
      facebook_url: {
        ref: this.facebookUrl
      },
      twitter_url: {
        ref: this.twitterUrl
      },
      github_url: {
        ref: this.githubUrl
      },
      icon: {
        ref: this.icon
      },
      tagline: {
        ref: this.tagline
      },
      description: {
        ref: this.description
      },
      plans: {
        ref: this.plans,
        furtherFormat: this.formatPlans
      },
      features: {
        ref: this.features
      },
      jobs: {
        ref: this.jobs
      },
      configs: {
        ref: this.configs,
        furtherFormat: this.formatConfigs
      },
      api: {
        ref: this.api
      }
    };

    var payload = {};
    var invalidRefs = [];

    _.each(refsMap, function (info, key) {
      var data = info.ref.serialize();

      if (data.valid) {
        var value = data.value;

        if (info.furtherFormat) {
          value = info.furtherFormat(value);
        }

        payload[key] = value;
      } else {
        console.log(key);
        invalidRefs.push(info.ref);
      }
    });

    var firstInvalidRef = invalidRefs.shift();

    if (firstInvalidRef) {
      this.scrollToRef(firstInvalidRef);
    }

    return payload;
  },

  scrollToRef: function (el) {
    $('html, body').animate({ scrollTop: $(el).offset().top }, 500);
  },

  saveService: function () {
    var payload = this.serialize();

    // React.post('/addons/modify', _.extend(payload, { addon_uuid: this.props.addon_uuid }), {
    //   success: function (data) {
    //     window.location = data.url;
    //   }
    // });
  },
  
  onPlanNameBlur: function (planName, planId) {
    this.features.comp.updatePlanName(planName, planId);
  },
  
  configSectionDescription: function () {
    var message = 'List the config vars that your API will return to users upon the successful provisioning of your service. Make sure each config var is in all-caps and is prefixed with ';
    var configPrefix = this.props.slug.toUpperCase().replace('-', '_');
    return message + '"' + configPrefix + '_".';
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
            <FormSection label={'Category'} required={true} compData={this.categoryData()} ref={this.setCategoryRef}/>
            <FormSection label={'Website URL'} required={false} compData={this.inputCompData(this.props.links.url)} ref={this.setUrlRef}/>
            <FormSection label={'Facebook URL'} required={false} compData={this.inputCompData(this.props.links.facebook_url)} ref={this.setFacebookUrlRef}/>
            <FormSection label={'Twitter URL'} required={false} compData={this.inputCompData(this.props.links.twitter_url)} ref={this.setTwitterUrlRef}/>
            <FormSection label={'GitHub URL'} required={false} compData={this.inputCompData(this.props.links.github_url)} ref={this.setGithubUrlRef}/>
            <FormSection label={'Icon'} required={true} compData={this.iconData()} ref={this.setIconRef}/>
            <FormSection label={'Short Description'} required={true} description={'This is a description of your project in 50 characters or less for the services page.'} compData={this.inputCompData(this.props.tagline, 50)} ref={this.setTaglineRef}/>
            <FormSection label={'Long Description'} required={true} description={'In greater detail, write a longer description about your service and its offerings.'} compData={this.descriptionData()} ref={this.setDescriptionRef}/>
            <FormSection label={'Plans & Pricing'} required={true} description={'Add the different pricing plans your service will support, in order of increasing price.'} compData={this.planData()} onRemoveRow={this.onRemovePlan} onNewRow={this.onNewPlan} onBlurFirstCol={this.onPlanNameBlur} ref={this.setPlansRef}/>
            <FormSection label={'Features'} required={true} description={'Add your service\'s features and their values for each plan.'} compData={this.featureData()} ref={this.setFeaturesRef}/>
            <FormSection label={'Jobs'} required={false} description={'Add any files or libraries you would like to be automatically added to users\' projects when provisioning your service. These "jobs" will help get users up and running with your service even quicker.'} compData={this.jobsData()} ref={this.setJobsRef}/>
            <FormSection label={'Config Vars'} required={false} description={this.configSectionDescription()} compData={this.configData()} ref={this.setConfigsRef}/>
            <FormSection label={'API'} required={this.props.api_required} description={'Add the URLs that Conflux will use to interact with your service.'} compData={this.apiData()} ref={this.setApiRef}/>
          </div>
          <div className="edit-service-footer">
            <div className="save-service-btn" onClick={this.saveService}>Save Service</div>
          </div>
        </div>
      </div>
    );
  }
});