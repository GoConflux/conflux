var Home = React.createClass({

  terminalOutputs: [
    {
      text: "Provisioning redistogo service...",
      delay: 1000
    },
    {
      text: "Writing new configs to conflux.yml...",
      delay: 500
    },
    {
      text: "Found 2 new jobs for redistogo.",
      delay: 500
    },
    {
      text: "Installing <span style=\"color: #E9573F\">redis</span> ruby gem...",
      delay: 1000
    },
    {
      text: "<span style=\"color: #59A45C\">Creating file:</span> config/initializers/redis.rb...",
      delay: 500
    },
    {
      text: "<span style=\"color: #0EBEC1\">Successfully added redistogo to local-bundle-1.</span>",
      delay: 0
    }
  ],

  setTerminalContainerRef: function (ref) {
    this.terminalContainer = ref;
  },

  setTerminalTextRef: function (ref) {
    this.terminal = ref;
  },

  componentDidMount: function () {
    this.startTerminalAnimation();
  },

  startTerminalAnimation: function () {
    var self = this;

    $(this.terminal).typed({
      strings: ['$ conflux services:add redistogo'],
      typeSpeed: 0,
      onStringTyped: function () {
        setTimeout(function () {
          $(self.terminalContainer).addClass('with-output');
          $(self.terminal).append($('<br>'));
          $(self.terminalContainer).find('.typed-cursor').addClass('new-line');
          self.showTerminalOutput(0);
        }, 300);
      }
    });
  },

  showTerminalOutput: function (i) {
    var self = this;
    var info = this.terminalOutputs[i];
    var $output = $('<span>', { html: info.text });
    $(this.terminal).append($output);
    $(this.terminal).append($('<br>'));

    setTimeout(function () {
      i++;

      if (self.terminalOutputs[i]) {
        self.showTerminalOutput(i);
      } else {
        $(self.terminalContainer).find('.typed-cursor').hide();

        setTimeout(function () {
          self.resetTerminalAnimation();
        }, 15000);
      }
    }, info.delay);
  },

  resetTerminalAnimation: function () {
    $(this.terminalContainer).empty();
    $(this.terminalContainer).removeClass('with-output');
    var $newTerminalText = $('<div>', { class: 'terminal-text' });
    this.terminal = $newTerminalText[0];
    $(this.terminalContainer).append($newTerminalText);
    this.startTerminalAnimation();
  },

  getMainActionBtn: function () {
    if (this.props.authed) {
      return <a className="home-main-action-btn" href="/download">Get Started</a>;
    } else {
      return <a className="home-main-action-btn extra-padding" href="/signup">Sign Up</a>;
    }
  },

  render: function() {
    return (
      <div id="home">
        <div className="home-header">
          <div className="title">Developer services that go where you do</div>
          <div className="subtitle">Group your app's third-party services into bundles easily accessible from any host environment.</div>
          <div className="home-main-action-btn-container">{this.getMainActionBtn()}</div>
        </div>
        <div id="homeBody">
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Provision & configure services in one command.</div>
                  <div className="sub-text">Conflux makes it possible to provision new developer services in one simple command. <span className="highlight">Further configuration &mdash; new libraries, config vars, or service-specific files &mdash; is taken care of for you</span>, reducing setup time and allowing you to focus more on your product.</div>
                </div>
              </div>
              <div className="sub-section">
                <div className="terminal-example" ref={this.setTerminalContainerRef}>
                  <div className="terminal-text" ref={this.setTerminalTextRef}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <img className="image-section left" src="https://ds8ypexjwou5.cloudfront.net/images/platform-agnostic-3.png" />
              </div>
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Configure once. Use anywhere.</div>
                  <div className="sub-text">Whether locally or in the cloud, where you host your app shouldn't matter when it comes to your third-party services. <span className="highlight">Conflux services are platform-agnostic,</span> so once they're provisioned, you can access them from any platform or share them across multiple. One command is all it takes to connect to the service bundle you see fit.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Clone & scale services across environments.</div>
                  <div className="sub-text">Spinning up a new dev environment shouldn't require you to manually configure a whole new set of services. Conflux lets you <span className="highlight">clone your service bundles in one click</span>, with an easy means of scaling up services along the way. Not only does this reduce setup time, but it also helps <span className="highlight">ensure parity across dev environments.</span></div>
                </div>
              </div>
              <div className="sub-section">
                <img className="image-section right" src="https://ds8ypexjwou5.cloudfront.net/images/clone-7.png" />
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <img className="image-section left" src="https://ds8ypexjwou5.cloudfront.net/images/abstract-configs.png" />
              </div>
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Abstract away config management.</div>
                  <div className="sub-text">Forget needing to maintain a local copy of integration configs in order for your app to work. Conflux <span className="highlight">consolidates all of your services' configs into one secure location</span> that's always in sync with every developer on your team.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Define user roles for improved security.</div>
                  <div className="sub-text">Not every developer on your team needs access to all of your third-party services, especially those in production. Built-in user roles make it easy to <span className="highlight">specify exactly who on your team has access to the tools that matter most.</span></div>
                </div>
              </div>
              <div className="sub-section">
                <img className="image-section right new-contrib" src="https://ds8ypexjwou5.cloudfront.net/images/invite-user-3.png" />
              </div>
            </div>
          </div>
          <a href="/download" className="sub-footer-action-section">
            <div className="home-section get-toolbelt">
              <div className="sub-footer-action-text-container"><i className="fa fa-terminal"></i> Get started with the open source <span className="sub-footer-action-text">Conflux Toolbelt</span>.</div>
            </div>
          </a>
        </div>
        <LandingFooter />
      </div>
    );
  }
});