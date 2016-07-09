var Toolbelt = React.createClass({

  setSupportSectionRef: function (ref) {
    this.supportSection = ref;
  },

  promptNewTeam: function () {
    if (this.props.authed) {
      React.modal.show('team:create', {}, {
        onConfirm: this.createNewTeam
      });
    } else {
      window.location = '/signup';
    }
  },
  
  createNewTeam: function (data) {
    React.post('/teams', data, {
      success: function (resp) {
        window.location = resp.url;
      }
    });
  },

  scrollToSupportSection: function () {
    var topOfSupportSection = $(this.supportSection).offset().top;
    $('html, body').animate({ scrollTop: topOfSupportSection }, 850);
  },
  
  render: function() {
    return (
      <div id="toolbelt">
        <div className="home-header"></div>
        <div className="toolbelt-subheader conflux-container">
          <div className="title">Conflux Toolbelt</div>
          <div className="subtitle">Get up and running with Conflux by downloading the developer toolbelt. Connect to your add-ons, add new team members, and much more, straight from the command line. Follow the guide below to get started, or <a href="https://github.com/GoConflux/conflux-cli" target="_blank">view the source code on Github</a>.</div>
        </div>
        <div className="toolbelt-body conflux-container">
          <div className="before-getting-started md-text">Before getting started, make sure you have a Conflux account. If you haven't signed up yet, <a href="/signup">create an account</a>. Also check to <span className="feaux-link" onClick={this.scrollToSupportSection}>make sure your operating system and app's language are supported.</span></div>
          <div className="conflux-md-numbered-section">
            <div className="numbered-title">1. Install the Toolbelt</div>
            <div className="md-section-description">
              <div className="md-text">Download and install the toolbelt by running the following command in your command shell:</div>
              <div className="md-shell"><span className="prompt">$</span> <span className="command">wget -O- https://goconflux.com/install.sh | sh</span></div>
            </div>
          </div>
          <div className="conflux-md-numbered-section">
            <div className="numbered-title">2. Log in</div>
            <div className="md-section-description">
              <div className="md-text">Once installed, you'll have access to the <span className="md-shell">conflux</span> command from your command shell (Note: type <span className="md-shell">conflux help</span> at any time to see a list of available commands).</div>
              <div className="md-text">Log in using the email address and password you used when creating your Conflux account:</div>
              <div className="md-shell">
                <span className="prompt">$</span> <span className="command">conflux login</span><br/>
                Enter your Conflux credentials.<br/>
                Email: ben@example.com<br/>
                Password (typing will be hidden):<br/>
                Successfully logged in as ben@example.com<br/>
              </div>
            </div>
          </div>
          <div className="conflux-md-numbered-section">
            <div className="numbered-title">3. Connect your project to a Conflux app</div>
            <div className="md-section-description">
              <div className="md-text">If you haven't created a Conflux team yet, go ahead and <span className="feaux-link" onClick={this.promptNewTeam}>create a new team</span>. Your team should come pre-configured with a local Conflux app &mdash; a group of conflux add-ons mapping to a specific environment.</div>
              <div className="sub-section">
                <div className="sub-section-title">Local Directory</div>
                <div className="md-section-description">
                  <div className="md-text">To establish which Conflux app to use for a local project, run <span className="md-shell">conflux init</span> from inside that project's root directory and choose the app you wish to use:</div>
                  <div className="md-shell">
                    <span className="prompt">my-app $</span> <span className="command">conflux init</span><br/>
                    <br/>
                    Which Conflux app does this project belong to?<br/>
                    <br/>
                    MyTeam:<br/>
                    <br/>
                    (1) myteam-local<br/>
                    (2) myteam-dev-1<br/>
                    (3) myteam-prod<br/>
                    <br/>
                    <span className="command">1</span><br/>
                    Configuring manifest.json...<br/>
                    Installing conflux ruby gem...<br/>
                    Successfully connected project to conflux app: myteam-local
                  </div>
                  <div className="md-text">Once this connection is established, run <span className="md-shell">conflux pull</span> to check if any jobs need to be run to finish configuring your add-ons:</div>
                  <div className="md-shell">
                    <span className="prompt">my-app $</span> <span className="command">conflux pull</span><br/>
                    Writing configs to conflux.yml...<br/>
                    Found 2 new jobs for redistogo.<br/>
                    Installing redis ruby gem...<br/>
                    Creating file: config/initializers/redis.rb<br/>
                    Done.<br/>
                  </div>
                  <div className="md-text">At this point, you can view the <span className="md-shell">.conflux/conflux.yml</span> file inside your project's root directory to see which configs will be available when you boot your server. For example:</div>
                  <div className="md-shell">
                    <span className="prompt">my-app $</span> <span className="command">cat .conflux/conflux.yml</span><br/>
                    <br/>
                    # CONFLUX CONFIG VARS:<br/>
                    <br/>
                    # All config vars seen here are in use and pulled from Conflux.<br/>
                    # If any are ever overwritten, they will be marked with "Overwritten"<br/>
                    # If you ever wish to overwrite any of these, do so inside of a config/application.yml file.<br/>
                    <br/>
                    # Redis To Go<br/>
                    REDISTOGO_URL<br/>
                    <br/>
                    # PubNub<br/>
                    PUBNUB_PUBLISH_KEY<br/>
                    PUBNUB_SUBSCRIBE_KEY<br/>
                    PUBNUB_TEST_CHANNEL  # My custom config<br/>
                    <br/>
                    # SendGrid<br/>
                    SENDGRID_PASSWORD<br/>
                    SENDGRID_USERNAME<br/>
                  </div>
                </div>
              </div>
              <div className="sub-section">
                <div className="sub-section-title">Remote Directory</div>
                <div className="md-section-description">
                  <div className="md-text">Instead of relying on the toolbelt to establish a Conflux connection on a remote server, you can utilize a rake task built into the <a href="https://github.com/GoConflux/conflux-rb" target="_blank">Conflux ruby gem</a> to do just that:</div>
                  <div className="md-shell">
                    <span className="prompt">my-remote-app $</span> <span className="command">bundle exec rake conflux:set_app</span><br/>
                    Email: ben@example.com<br/>
                    Password (typing will be hidden):<br/>
                    <br/>
                    Which Conflux app does this project belong to?<br/>
                    <br/>
                    MyTeam:<br/>
                    <br/>
                    (1) myteam-local<br/>
                    (2) myteam-dev-1<br/>
                    (3) myteam-prod<br/>
                    <br/>
                    <span className="command">1</span><br/>
                    Configuring manifest.json...<br/>
                    Successfully connected project to conflux app: myteam-local<br/>
                  </div>
                </div>
              </div>
              <div className="sub-section">
                <div className="sub-section-title">Heroku App</div>
                <div className="md-section-description">
                  <div className="md-text">Connecting a Heroku app to a Conflux app can be done in just one command:</div>
                  <div className="md-shell"><span className="prompt">$</span> <span className="command">conflux apps:heroku_use my-conflux-app -a my-heroku-app</span><br/>
                    Setting CONFLUX_USER, CONFLUX_APP and restarting ⬢ my-heroku-app... done, v133<br/>
                    CONFLUX_APP:  XXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXXX<br/>
                    CONFLUX_USER: XXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXXX<br/>
                    Successfully connected Heroku app 'my-heroku-app' to conflux app 'my-conflux-app'.<br/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="conflux-md-numbered-section">
            <div className="numbered-title">4. Start using your Add-ons</div>
            <div className="md-section-description">
              <div className="md-text">Once your project is connected to the Conflux app of your choice, your add-ons will automatically be made available any time you start up your server. This way, you can stop worrying about setup and get back to building out your app. Enjoy your add-ons!</div>
            </div>
          </div>
        </div>
        <div className="toolbelt-support" ref={this.setSupportSectionRef}>
          <div className="support-title">Toolbelt Support</div>
          <div className="support-body">
            <div className="support-body-inner">
              <div className="support-section"><span className="topic">Operating sytems:&nbsp;&nbsp;</span>Mac OS X, Linux, (Windows coming soon)</div>
              <div className="support-section"><span className="topic">Languages:&nbsp;&nbsp;</span>Ruby (Rails)</div>
            </div>
          </div>
        </div>
        <LandingFooter />
      </div>
    )
  }
});
