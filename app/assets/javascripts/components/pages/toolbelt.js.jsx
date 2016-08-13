var Toolbelt = React.createClass({

  osList: [
    {
      name: 'Mac OS X',
      link: '/downloads/conflux-toolbelt.pkg'
    },
    {
      name: 'Windows',
      link: '/downloads/conflux-toolbelt.exe',
      helpText: "On Windows, make sure to <span class=\"md-text-strong\">Run as Administrator</span> and add <span class=\"md-text-strong no-wrap\">C:\\Program Files\\conflux\\bin</span> to your path."
    },
    {
      name: 'Linux',
      manualDownload: true
    }
  ],

  selectedOS: 0,

  changeOS: function (e) {
    var selectedIndex = Number($(e.target).closest('.os-option').attr('data-os-index'));

    if (selectedIndex != this.selectedOS) {
      this.selectedOS = selectedIndex;
      var $selectedOSEl = $('[data-os-index=' + this.selectedOS + ']');
      $selectedOSEl.siblings().removeClass('selected');
      $selectedOSEl.addClass('selected');

      var selectedInfo = this.getSelectedOS();

      if (selectedInfo.manualDownload) {
        $(this.downloadBtn).hide();
        $(this.helpText).hide();
        $(this.manualDownload).show();
      } else {
        $(this.manualDownload).hide();
        $(this.downloadBtn).find('.btn-text').html('Conflux Toolbelt for ' + this.getSelectedOS().name);
        $(this.downloadBtn).attr('href', this.getSelectedOS().link);
        $(this.downloadBtn).show();

        selectedInfo.helpText ?
          $(this.helpText).html(selectedInfo.helpText).show() :
          $(this.helpText).hide();
      }
    }
  },

  setScrollTopBtnRef: function (ref) {
    this.scrollTopBtn = ref;

    this.scrollTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      $('html, body').animate({ scrollTop: 0 }, 600);

      return false;
    });
  },

  setSupportSectionRef: function (ref) {
    this.supportSection = ref;
  },

  setDownloadBtnRef: function (ref) {
    this.downloadBtn = ref;
  },

  setManualDownloadRef: function (ref) {
    this.manualDownload = ref;
  },

  setHelpTextRef: function (ref) {
    this.helpText = ref;
  },

  registerDownload: function () {
    mixpanel.track('Toolbelt Download', { os: this.getSelectedOS().name });
  },

  copyManualDownloadCmd: function () {
    // Get command text to copy from .command element.
    var textToCopy = $('.manual-download').find('.command').text();

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

  getSelectedOS: function () {
    return this.osList[this.selectedOS];
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
          <div className="subtitle">Get up and running with Conflux by downloading the developer toolbelt. Connect to your services, add new team members, and much more, straight from the command line. Follow the guide below to get started, or <a href="https://github.com/GoConflux/conflux-cli" target="_blank">view the source code on Github</a>.</div>
        </div>
        <div className="toolbelt-body conflux-container">
          <div className="before-getting-started md-text">Before getting started, make sure you have a Conflux account. If you haven't signed up yet, <a href="/signup">create an account</a>. Also check to <span className="feaux-link" onClick={this.scrollToSupportSection}>make sure your operating system and app's language are supported.</span></div>
          <div className="conflux-md-numbered-section">
            <div className="numbered-title">1. Install the Toolbelt</div>
            <div className="md-section-description">
              <div className="download-os-options-container">
                <div className="os-option selected" data-os-index="0" onClick={this.changeOS} title="Max OS X">
                  <img className="os-icon" src="https://ds8ypexjwou5.cloudfront.net/images/osx.svg" />
                </div>
                <div className="os-option" data-os-index="1" onClick={this.changeOS} title="Windows">
                  <img className="os-icon" src="https://ds8ypexjwou5.cloudfront.net/images/windows.svg" />
                </div>
                <div className="os-option" data-os-index="2" onClick={this.changeOS} title="Linux">
                  <img className="os-icon" src="https://ds8ypexjwou5.cloudfront.net/images/linux.svg" />
                </div>
              </div>
              <div className="download-btn-container">
                <div className="help-text md-text" ref={this.setHelpTextRef}></div>
                <a className="download-toolbelt" href={this.getSelectedOS().link} ref={this.setDownloadBtnRef} onClick={this.registerDownload}><i className="fa fa-download download-icon"></i><span className="btn-text">Conflux Toolbelt for {this.getSelectedOS().name}</span></a>
                <div className="manual-download" ref={this.setManualDownloadRef}>
                  <div className="md-text">For Linux, install the toolbelt by running the following in your command shell:</div>
                  <div className="md-shell relative"><span className="prompt">$</span> <span className="command">wget -O- https://goconflux.com/install.sh | sh</span><i className="fa fa-clipboard copy-to" title="copy" onClick={this.copyManualDownloadCmd}></i></div>
                </div>
              </div>
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
            <div className="numbered-title">3. Connect your app to a Conflux bundle</div>
            <div className="md-section-description">
              <div className="md-text">If you haven't created a Conflux team yet, go ahead and <span className="feaux-link" onClick={this.promptNewTeam}>create a new team</span>. Your team should already come pre-configured with an empty Conflux bundle (i.e. a bundle of services).</div>
              <div className="sub-section">
                <div className="sub-section-title">Local Directory</div>
                <div className="md-section-description">
                  <div className="md-text">To establish which Conflux bundle to use with your project's local environment, run <span className="md-shell">conflux init</span> from inside that project's root directory and choose the bundle you wish to use:</div>
                  <div className="md-shell">
                    <span className="prompt">my-app $</span> <span className="command">conflux init</span><br/>
                    <br/>
                    Which Conflux bundle do you wish to use for this project?<br/>
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
                    Adding conflux to Gemfile...<br/>
                    Successfully connected project to conflux bundle: myteam-local
                  </div>
                  <div className="md-text">Once this connection is established, you can go ahead and start provisioning some services for your bundle. For example, the following is all it takes to spin up a new Redis To Go instance for your app:</div>
                  <div className="md-shell">
                    <span className="prompt">my-app $</span> <span className="command">conflux services:add redistogo</span><br/>
                    Successfully added redistogo to myteam-local.<br/>
                    Writing configs to conflux.yml...<br/>
                    Found 3 new jobs for redistogo...<br/>
                    Installing redis ruby gem...<br/>
                    Adding redis to Gemfile...<br/>
                    Creating file: config/initializers/redistogo.rb<br/>
                    Creating file: .conflux/redistogo/getting_started.rb<br/>
                    Done.
                  </div>
                  <div className="md-text">Now that Redis To Go has been provisioned, if you run <span className="md-shell">conflux configs</span>, you should see that <span className="md-shell">REDISTOGO_URL</span> has been added to the list of configs that are automatically made available when you boot your server.</div>
                  <div className="md-shell">
                    <span className="prompt">my-app $</span> <span className="command">conflux configs</span><br/>
                    REDISTOGO_URL<br/>
                    ...
                  </div>
                  <div className="md-text">Since Conflux ran a job to create a <span className="md-shell">redistogo.rb</span> initializer file, you should already have a <span className="md-shell">$redis</span> global variable pointing to your new redis instance:</div>
                  <div className="md-shell">
                    <span className="prompt">my-app $</span> <span className="command">rails console</span><br/>
                    Loading development environment (Rails 4.x.x)<br/>
                    2.x.x :001 > <span className="command">$redis</span><br/>
                    => #&#60;Redis client v3.3.0 for redis://catfish.redistogo.com:10837/0&#62;
                  </div>
                  <div className="md-text">That's it! One command is all it takes to get up and running with almost any Conflux service. Each service also comes with a <span className="md-shell">getting_started</span> file showing example code and other helpful tips. You can find these files inside of your <span className="md-shell">.conflux/</span> directory.</div>
                </div>
              </div>
              <div className="sub-section">
                <div className="sub-section-title">Remote Directory</div>
                <div className="md-section-description">
                  <div className="md-text">Instead of relying on the toolbelt to establish a Conflux connection on a remote server, you can utilize a rake task built into the <a href="https://github.com/GoConflux/conflux-rb" target="_blank">Conflux ruby gem</a> to do just that:</div>
                  <div className="md-shell">
                    <span className="prompt">my-remote-app $</span> <span className="command">bundle exec rake conflux:use_bundle</span><br/>
                    Email: ben@example.com<br/>
                    Password (typing will be hidden):<br/>
                    <br/>
                    Which Conflux bundle does this project belong to?<br/>
                    <br/>
                    MyTeam:<br/>
                    <br/>
                    (1) myteam-local<br/>
                    (2) myteam-dev-1<br/>
                    (3) myteam-prod<br/>
                    <br/>
                    <span className="command">1</span><br/>
                    Configuring manifest.json...<br/>
                    Successfully connected project to conflux bundle: myteam-local<br/>
                  </div>
                </div>
              </div>
              <div className="sub-section">
                <div className="sub-section-title">Heroku App</div>
                <div className="md-section-description">
                  <div className="md-text">Connecting a Heroku app to a Conflux bundle can be done in just one command:</div>
                  <div className="md-shell"><span className="prompt">$</span> <span className="command">conflux apps:heroku_use my-conflux-bundle -a my-heroku-app</span><br/>
                    Setting CONFLUX_USER, CONFLUX_APP and restarting ⬢ my-heroku-app... done, v133<br/>
                    CONFLUX_APP:  XXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXXX<br/>
                    CONFLUX_USER: XXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXXX<br/>
                    Successfully connected Heroku app 'my-heroku-app' to conflux bundle 'my-conflux-bundle'.<br/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="conflux-md-numbered-section">
            <div className="numbered-title">4. Start using your services</div>
            <div className="md-section-description">
              <div className="md-text">Once your project is connected to the Conflux bundle of your choice, your services will automatically be made available any time you start up your server. This way, you can stop worrying about setup and get back to building out your app. Enjoy your services!</div>
            </div>
          </div>
        </div>
        <div className="toolbelt-support" ref={this.setSupportSectionRef}>
          <i className="fa fa-arrow-up scroll-top-btn" ref={this.setScrollTopBtnRef}></i>
          <div className="support-title">Toolbelt Support</div>
          <div className="support-body">
            <div className="support-body-inner">
              <div className="support-section"><span className="topic">Operating systems:&nbsp;&nbsp;</span>Mac OS X, Windows, Linux</div>
              <div className="support-section"><span className="topic">Languages:&nbsp;&nbsp;</span>Ruby (Rails), (Node and Python coming soon)</div>
              <div className="support-section"><span className="topic">Dependencies:&nbsp;&nbsp;</span>ruby >= 2.0.0, wget/curl</div>
            </div>
          </div>
        </div>
        <LandingFooter />
      </div>
    )
  }
});
