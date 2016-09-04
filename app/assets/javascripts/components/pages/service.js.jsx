var Service = React.createClass({

  setFeaturesRef: function (ref) {
    this.features = ref;
  },

  setPlansRef: function (ref) {
    this.plans = ref;
  },

  getLikesIcon: function () {
    var icon = this.props.likes.has_liked ? 'heart-icon-solid' : 'heart-icon-hollow';
    return 'https://ds8ypexjwou5.cloudfront.net/images/' + icon + '.svg';
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

  editLink: function () {
    return '/services/' + this.props.slug + '/edit';
  },
  
  onPlanSelected: function (e) {
    this.plans.setState({
      selected: Number($(e.target).closest('li').attr('data-plan-index')) || 0
    });
  },

  render: function() {
    return (
      <div id="service">
        <div className="home-header"></div>
        <div className="service-container conflux-container">
          <div className="service-header">
            <div className="primary-info-container">
              <img className="service-icon" src={this.props.icon} />
              <div className="service-name">{this.props.name}</div>
              <div className="service-tagline">{this.props.tagline}</div>
            </div>
            <div className="secondary-info-container">
              <div className="likes-links-container">
                <div className="likes">
                  <img src={this.getLikesIcon()} className="likes-icon"/>
                  <div className="likes-count">{this.props.likes.count}</div>
                </div>
                {this.getLikesLinksSeparator()}
                <ServiceLinks data={this.props.links} />
              </div>
              <div className="starting-at-container">
                <div className="starting-at">{this.getStartingAtText()}</div>
              </div>
            </div>
          </div>
          <div className="service-body">
            <div id="description" className="service-section">
              <Markdown content={this.props.description} />
            </div>
            <div id="plans" className="service-section">
              <div className="service-section-title">Plans & Pricing</div>
              <Plans data={this.props} writeAccess={true} hideSubsectionTitle={true} onPlanSelected={this.onPlanSelected} ref={this.setPlansRef} />
              <Features data={this.props.features} ref={this.setFeaturesRef} />
            </div>
            <div id="provisioning" className="service-section">
              <div className="service-section-title">Provisioning</div>
            </div>
          </div>
        </div>
        <a className="edit-service-btn" href={this.editLink()}>Edit</a>
      </div>
    );
  }

});