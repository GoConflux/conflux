var Menu = React.createClass({

  getInitialState: function () {
    return {
      pipelines: this.props.pipelines
    };
  },

  componentDidMount: function () {
    try {
      this.addMenuBtnListener();
      this.addWindowResizeListener();
      this.addPlusBtnListener();
      this.addMouseUpListener();
    } catch (e) {}
  },

  addMenuBtnListener: function () {
    var self = this;

    $('#headerMenuBtn').click(function () {
      self.showMenu();
    });
  },

  addWindowResizeListener: function () {
    $(window).resize(function () {
      if (window.innerWidth > 991) {
        $('#menu').removeClass('slide-out');
      }
    });
  },

  addPlusBtnListener: function () {
    var self = this;

    $('#menuBody .ghost-add-btn').click(function () {
      if (React.modal) {
        React.modal.show('pipeline:create', {
          team_uuid: self.props.team_uuid
        });
      }
    });
  },

  addMouseUpListener: function () {
    $('#menuPipelinesList > a').mouseup(function (e) {
      if (!e.ctrlKey && !e.metaKey) {
        $(e.currentTarget).siblings().removeClass('selected');
        $(e.currentTarget).addClass('selected');
      }
    });
  },

  showMenu: function () {
    $('#menu').addClass('slide-out');
  },

  hideMenu: function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#menu').removeClass('slide-out');
    return false;
  },

  handlePipelineClick: function () {
    console.log('heard click');
  },

  formatPipelines: function () {
    return this.state.pipelines.map(function (pipeline) {
      var classes = pipeline.selected ? 'selected' : '';
      return <a href={pipeline.link} className={classes}><li key={pipeline.name} onClick={this.handlePipelineClick} className="menu-pipeline"><i className="fa fa-circle"></i><div className="pipeline-name">{pipeline.name}</div></li></a>;
    });
  },

  getMenuTeamIcon: function () {
    var el;

    if (this.props.icon) {
      el = <div id="menuTeamIcon" style={{ backgroundImage: "url('" + this.props.icon + "')" }}></div>;
    } else {
      el = <div id="menuTeamIcon" className="no-icon">{this.props.name[0].toUpperCase()}</div>
    }

    return el;
  },

  render: function() {
    var menuFooterLink = 'menu-footer-link';
    var teamSettingsBtnClasses = menuFooterLink += (this.props.team_settings_selected ? ' selected' : '');
    var usersBtnClasses = menuFooterLink += (this.props.users_selected ? ' selected' : '');

    return (
      <div id="menu">
        <a href={this.props.link}><div id="menuHeader">
          {this.getMenuTeamIcon()}
          <div id="menuTeamName">{this.props.name}</div>
          <i className="fa fa-angle-left slide-menu-back-icon" onClick={this.hideMenu}></i>
        </div></a>
        <div id="menuBody">
          <div className="menu-body-item">
            <div className="section-title">Pipelines</div>
            <div className="ghost-add-btn">+</div>
            <ul id="menuPipelinesList">{this.formatPipelines()}</ul>
          </div>
        </div>
        <div id="menuFooter">
          <a href="#" className={teamSettingsBtnClasses}>
            <img src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/gear.png"/>
          </a>
          <a href={this.props.link + '/users'} className={usersBtnClasses}>
            <i className="fa fa-users"></i>
          </a>
        </div>
      </div>
    );
  }
});