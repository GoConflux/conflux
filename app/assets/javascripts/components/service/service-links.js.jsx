var ServiceLinks = React.createClass({

  iconsMap: {
    url: {
      icon: 'home.svg',
      classes: 'home'
    },
    facebook_url: {
      icon: 'facebook-icon.svg',
      classes: 'facebook'
    },
    twitter_url: {
      icon: 'twitter-icon.svg',
      classes: 'twitter'
    },
    github_url: {
      icon: 'github-icon.svg',
      classes: 'github'
    }
  },

  getLinkIcons: function () {
    var self = this;
    var links = [];

    Object.keys(this.props.data).forEach(function (key) {
      var linkUrl = self.props.data[key];

      if (linkUrl) {
        var iconInfo = self.iconsMap[key];
        var iconUrl = 'https://ds8ypexjwou5.cloudfront.net/images/' + iconInfo.icon;
        var iconClasses = 'service-link-icon ' + iconInfo.classes;

        links.push(<a className="service-link" href={linkUrl} target="_blank"><img className={iconClasses} src={iconUrl} /></a>);
      }
    });

    return links.length == 0 ? null : links;
  },

  render: function() {
    return (
      <div className="service-links">{this.getLinkIcons()}</div>
    );
  }
});