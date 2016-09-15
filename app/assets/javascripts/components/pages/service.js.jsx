var Service = React.createClass({

  setFeaturesRef: function (ref) {
    this.features = ref;
  },

  setPlansRef: function (ref) {
    this.plans = ref;
  },

  getLikesLinksSeparator: function () {
    var hasLink = false;
    var self = this;

    Object.keys(this.props.links).forEach(function (key) {
      if (self.props.links[key]) {
        hasLink = true;
      }
    });

    return hasLink ? <span className="service-middot">&middot;</span> : null;
  },

  getStartingAtText: function () {
    if (this.props.starting_at == '0') {
      return 'Free plan available';
    } else {
      return 'Starting at $' + this.props.starting_at + '/mo';
    }
  },

  onPlanSelected: function (e) {
    var planIndex = Number($(e.target).closest('li').attr('data-plan-index')) || 0;

    this.plans.setState({ selected: planIndex });

    this.features.setState({
      features: this.props.features,
      plan: this.props.plans[planIndex].slug
    });
  },

  editButton: function () {
    if (!this.props.permissions.can_edit) {
      return;
    }

    return <a className="edit-service-btn" href={'/services/' + this.props.slug + '/edit'}>Edit</a>;
  },


  adminButton: function () {
    if (!this.props.permissions.can_add_admin) {
      return;
    }

    return <div className="add-admin-btn" onClick={this.onAdminClick}>Admins</div>;
  },
  
  onAdminClick: function () {
    var self = this;

    React.get('/addons/admin', { addon_uuid: this.props.addon_uuid }, {
      success: function (data) {
        React.modal.show('addon:admins', _.extend(data, { addon_uuid: self.props.addon_uuid }));
      }
    });
  },

  copyProvisionCmd: function () {
    // Get command text to copy from .command element.
    var textToCopy = $('.provision-section').find('.command').text();

    // Create a new temporary input element that's hidden & append it to body.
    var $tempInput = $('<input>', { class: 'wayyy-back' });
    $('body').append($tempInput);

    // Select this input element and copy it's text (the text we want).
    $tempInput.val(textToCopy).select();

    // Copy that shit.
    document.execCommand("copy");

    // Remove that shit.
    $tempInput.remove();
  },

  getIconClasses: function () {
    var classes = 'service-icon';

    if (!this.props.icon) {
      classes += ' no-icon';
    }

    return classes;
  },
  
  getStatus: function () {
    if (!this.props.permissions.can_edit) {
      return;
    }

    return <div className="service-status">Status: <div className={'status ' + this.props.display_status.toLowerCase()}>{this.props.display_status}</div></div>;
  },

  render: function() {
    return (
      <div id="service">
        <div className="home-header"></div>
        <div className="service-container conflux-container">
          <div className="service-header">
            <div className="primary-info-container">
              <img className={this.getIconClasses()} src={this.props.icon || 'https://ds8ypexjwou5.cloudfront.net/images/no-addon-icon.svg'} />
              <div className="service-name">{this.props.name}</div>
              <div className="service-tagline">{this.props.tagline}</div>
            </div>
            <div className="secondary-info-container">
              <div className="likes-links-container">
                <LikeService authed={this.props.authed} count={this.props.likes.count} hasLiked={this.props.likes.has_liked} addonUuid={this.props.addon_uuid}/>
                {this.getLikesLinksSeparator()}
                <ServiceLinks data={this.props.links} />
              </div>
              <div className="starting-at-container">
                <div className="starting-at">{this.getStartingAtText()}</div>
                <span className="service-middot">&middot;</span>
                <div className="service-category">
                  <div className="category-name">{this.props.category || 'No Category'}</div>
                  <img src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/category-tag.svg" className="category-tag"/>
                </div>
              </div>
            </div>
          </div>
          <div className="service-body">
            <div id="description" className="service-section">
              <Markdown content={this.props.description} />
            </div>
            <div id="plans" className="service-section">
              <div className="service-section-title">Plans & Pricing</div>
              <div className="plans-container">
                <Plans data={this.props} writeAccess={true} hideSubsectionTitle={true} onPlanSelected={this.onPlanSelected} ref={this.setPlansRef} />
              </div>
              <div className="features-container">
                <Features features={this.props.features} plan={(this.props.plans[0] || {}).slug} ref={this.setFeaturesRef} />
              </div>
            </div>
            <div id="provisioning" className="service-section">
              <div className="service-section-title">Provisioning</div>
              <div className="provision-section">
                <div className="provision-text">To provision a new instance of <span className="bold-me">{this.props.name}</span> with the <a href="/download" className="provision-link">Conflux toolbelt</a>, run the following command from inside your project's directory:</div>
                <div className="md-shell relative"><span className="prompt">$</span> <span className="command">conflux services:add {this.props.slug}</span><i className="fa fa-clipboard copy-to" title="copy" onClick={this.copyProvisionCmd}></i></div>
              </div>
            </div>
          </div>
        </div>
        {this.adminButton()}
        {this.editButton()}
        {this.getStatus()}
      </div>
    );
  }

});