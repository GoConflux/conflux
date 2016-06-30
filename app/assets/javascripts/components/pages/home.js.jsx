var Home = React.createClass({

  terminalOutputs: [
    {
      text: "Provisioning redistogo add-on...",
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
      text: "<span style=\"color: #59A45C\">Creating file:</span> config/redis.rb...",
      delay: 500
    },
    {
      text: "<span style=\"color: #0EBEC1\">Successfully configured redistogo.</span>",
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
      strings: ['$ conflux addons:add redistogo'],
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
          // self.resetTerminalAnimation();
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

  getStartedLink: function () {
    return this.props.authed ? '/toolbelt' : '/signup' ;
  },

  render: function() {
    return (
      <div id="home">
        <div className="home-header">
          <div className="title">Conflux Add-ons Platform & Marketplace</div>
          <div className="subtitle">Manage all of your app's third-party services from one secure location, regardless of host platform or environment.</div>
          <div className="home-main-action-btn-container">
            <a className="home-main-action-btn" href={this.getStartedLink()}>Get Started</a>
          </div>
        </div>
        <div id="homeBody">
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Provision & configure add-ons in one command.</div>
                  <div className="sub-text">Conflux makes it possible to provision new add-ons in one simple command. <span className="highlight">Further configuration &mdash; new libraries, config vars, or add-on specific files &mdash; is automatically taken care of</span>, reducing setup time and allowing you to focus more on your product.</div>
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
                <img className="image-section left" src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/platform-agnostic.png" />
              </div>
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Access add-on bundles from any host platform.</div>
                  <div className="sub-text">Whether locally or in the cloud, where you host your app shouldn't matter when it comes to your third-party services. <span className="highlight">Conflux add-ons are platform-agnostic.</span> So once they're provisioned, you can use them anywhere, making it possible to switch host providers without reconfiguring add-ons.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Easily clone & scale add-ons across environments.</div>
                  <div className="sub-text">Spinning up a new dev environment shouldn't require you to manually configure a whole new set of add-ons. Conflux lets you <span className="highlight">clone add-ons across environments with one click</span>, with an easy means of scaling up along the way.</div>
                </div>
              </div>
              <div className="sub-section">
                <img className="image-section right" src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/clone.png" />
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <img className="image-section left" src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/onboard.png" />
              </div>
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">On-board new team members with one click.</div>
                  <div className="sub-text">Rather than managing your team members from each service's site, <span className="highlight">manage them all in one place.</span> One invitation is all it takes to get new members up and running with the add-ons they need to start developing. <span className="new-section">Custom user roles make it possible to <span className="highlight">specify which add-ons each user has access to</span> for better internal security.</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Abstract out config management.</div>
                  <div className="sub-text">Forget about each developer having to maintain his own local copy of your integration configs in order for his app to work. Conflux <span className="highlight">consolidates all of your add-ons' configs into one secure location</span> that's always in sync with every developer on your team. <span className="new-section">Existing configs won't ever go stale, <span className="highlight">new add-on configs will be instantly available to other team members</span>, and you won't have to worry about excess copies of configs floating around.</span></div>
                </div>
              </div>
              <div className="sub-section">
                <img className="image-section right" src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/abstract-configs.png" />
              </div>
            </div>
          </div>
          <a href="/toolbelt" className="toolbelt-link">
            <div className="home-section get-toolbelt">
              <div className="get-toolbelt-text"><i className="fa fa-terminal"></i> Get started with the open source <span className="toolbelt-text">Conflux Toolbelt</span>.</div>
            </div>
          </a>
        </div>
        <LandingFooter />
      </div>
    );
  }
});