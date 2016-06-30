var Toolbelt = React.createClass({
  
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
  
  render: function() {
    return (
      <div id="toolbelt">
        <div className="home-header"></div>
        <div className="toolbelt-subheader conflux-container">
          <div className="title">Conflux Toolbelt</div>
          <div className="subtitle">Get up and running with Conflux by downloading the developer toolbelt. Connect to your add-ons, invite new team members, and much more, straight from the command line. Follow the guide below to get started, or <a href="https://github.com/GoConflux/conflux-cli" target="_blank">view the source code on Github</a>.</div>
        </div>
        <div className="toolbelt-body conflux-container">
          <div className="before-getting-started">Before getting started, make sure you have a Conflux account. If you haven't signed up yet, <a href="/signup">create an account here</a>.</div>
          <div className="conflux-md-numbered-section">
            <div className="numbered-title">1. Installing the Toolbelt</div>
            <div className="md-section-description">
              <div className="md-text">Download and install the toolbelt by running the following command in your command shell:</div>
              <div className="md-shell">$ wget -O- http://goconflux.com/install.sh | sh</div>
            </div>
          </div>
          <div className="conflux-md-numbered-section">
            <div className="numbered-title">2. Authentication</div>
            <div className="md-section-description">
              <div className="md-text">Once installed, you'll have access to the <span className="md-shell">conflux</span> command from your command shell. Go ahead and type <span className="md-shell">conflux help</span> to see a list of available commands.</div>
              <div className="md-text">Log in using the email address and password you used when creating your Conflux account.</div>
              <div className="md-shell">
                $ conflux login
                Enter your Confux credentials.
                Email: ben@example.com
                Password (typing will be hidden):
                Successfully logged in as ben@example.com.
              </div>
            </div>
          </div>
          <div className="conflux-md-numbered-section">
            <div className="numbered-title">3. Connecting a project to a Conflux app</div>
            <div className="md-text">If you haven't created a Conflux team yet, go ahead and <span className="feaux-link" onClick={this.promptNewTeam}>create a new team</span>. Your team should come pre-configured with a local <span className="md-text-strong">Conflux app</span> - a bundle of conflux add-ons mapping to a specific app environment.</div>
            <div className="sub-section">
              <div className="sub-section-title">Local Directory</div>
              <div className="md-section-description">
                <div className="md-text">To establish which set of add-ons to use for your local project, run <span className="md-shell">conflux init</span> from inside that project's directory and respond with the number next to the Conflux app you wish to use.</div>
                <div className="md-shell">
                  my-app $ conflux init

                  Which Conflux app does this project belong to?

                  MyTeam:

                  (1) myteam-local
                  (2) myteam-dev-1
                  (3) myteam-prod

                  1
                  Configuring manifest.json...
                  Installing conflux ruby gem...
                  Successfully connected project to conflux app: myteam-local
                </div>
                <div className="md-text">Once this connection is made, run <span className="md-shell">conflux pull</span> to see if any jobs need to be run to further configure your set of add-ons, as in the following example:</div>
                <div className="md-shell">
                  Writing configs to conflux.yml...
                  Found 2 new jobs for redistogo.
                  Installing redis ruby gem...
                  Creating file: config/redis.rb
                  Done.
                </div>
                <div className="md-text">At this point you can check your conflux/conflux.yml file inside your directory to see which add-on config vars will automatically be available for you when you start up your server. For example:</div>
                <div className="md-shell">
                  my-app $ cat .conflux/conflux.yml

                  # CONFLUX CONFIG VARS:

                  # All config vars seen here are in use and pulled from Conflux.
                  # If any are ever overwritten, they will be marked with "Overwritten"
                  # If you ever wish to overwrite any of these, do so inside of a config/application.yml file.

                  # Redis To Go
                  REDISTOGO_URL

                  # PubNub
                  PUBNUB_PUBLISH_KEY
                  PUBNUB_SUBSCRIBE_KEY
                  PUBNUB_TEST_CHANNEL  # My custom config

                  # SendGrid
                  SENDGRID_PASSWORD
                  SENDGRID_USERNAME
                </div>
              </div>
            </div>
            <div className="sub-section">
              <div className="sub-section-title">Remote Directory</div>
              <div className="md-section-description">
                <div className="md-text">In order to connect a remote directory to a set of Conflux add-ons, rather than using the Conflux Toolbelt on that remote server, you can utilize a rake task built into the conflux ruby gem:</div>
                <div className="md-shell">
                  my-remote-app $ bundle exec rake conflux:set_app
                  Email: ben@example.com
                  Password (typing will be hidden):

                  Which Conflux app does this project belong to?

                  MyTeam:

                  (1) myteam-local
                  (2) myteam-dev-1
                  (3) myteam-prod

                  1
                  Configuring manifest.json...
                  Successfully connected project to conflux app: myteam-local
                </div>
              </div>
            </div>
            <div className="sub-section">
              <div className="sub-section-title">Heroku App</div>
              <div className="md-section-description">
                <div className="md-text">Connecting a Heroku app to a specific set of Conflux add-ons is as simple as using the following command:</div>
                <div className="md-shell">$ conflux apps:heroku_use CONFLUX_APP -a HEROKU_APP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
