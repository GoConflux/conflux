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
      text: "<span style=\"color: #59A45C\">Creating initializer file:</span> config/redis.rb...",
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

  render: function() {
    return (
      <div id="home">
        <div className="home-header">
          <div className="title">Conflux Add-ons Platform & Marketplace</div>
          <div className="subtitle">Manage all of your app's third-party services from one secure location, regardless of host platform or environment.</div>
        </div>
        <div id="homeBody">
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Provision & configure add-ons in one command.</div>
                  <div className="sub-text">This is my subtext.</div>
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
                  <div className="sub-text">This is my subtext.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Easily clone & scale add-ons across environments.</div>
                  <div className="sub-text">This is my subtext.</div>
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
                  <div className="feature">Onboard new team members with one click.</div>
                  <div className="sub-text">This is my subtext.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Abstract out config management.</div>
                  <div className="sub-text">This is my subtext.</div>
                </div>
              </div>
              <div className="sub-section">
                <img className="image-section right" src="" />
              </div>
            </div>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }
});