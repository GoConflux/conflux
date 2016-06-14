var Menu = React.createClass({

  getInitialState: function () {
    return {
      pipelines: this.props.pipelines || []
    };
  },
  
  setDropdownRef: function (ref) {
    this.settingsDropdown = ref;
  },

  componentDidMount: function () {
    var self = this;

    try {
      this.addMenuBtnListener();
      this.addWindowResizeListener();
      this.addPlusBtnListener();
      this.addMouseUpListener();

      document.addEventListener('click', function () {
        self.settingsDropdown.hideDropdown();
      });

      var settingsIcon = $('[data-action=settings]')[0];

      if (settingsIcon) {
        settingsIcon.addEventListener('click', function (e) {
          self.settingsDropdown.toggleVisibility();
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
      }
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
    $('#menuPipelinesList > a.eager-select').mouseup(function (e) {
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

  formatPipelines: function () {
    if (this.state.pipelines.length == 0) {
      return <div className="no-pipelines-menu-message">No Pipelines</div>;
    } else {
      return this.state.pipelines.map(function (pipeline) {
        var classes = pipeline.selected ? 'selected' : '';
        return <a href={pipeline.link} className={classes}><li key={pipeline.name} className="menu-pipeline"><i className="fa fa-circle"></i><div className="pipeline-name">{pipeline.name}</div></li></a>;
      });
    }
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

  getSettingsDropdownOptions: function () {
    var self = this;

    return [
      {
        text: 'Edit Team',
        iconClasses: 'fa fa-pencil',
        onClick: function () {
          React.modal.show('team:update', { defaultName: self.props.name }, {
            onConfirm: self.updateTeam
          });

          setTimeout(function () {
            self.settingsDropdown.toggleVisibility();
          }, 50);
        }
      },
      {
        text: 'Delete Team',
        iconClasses: 'fa fa-trash',
        onClick: function () {
          React.modal.show('team:delete', null, {
            onConfirm: self.deleteTeam
          });

          setTimeout(function () {
            self.settingsDropdown.toggleVisibility();
          }, 50);
        }
      }
    ]
  },

  updateTeam: function (data) {
    data.team_uuid = this.props.team_uuid;

    React.put('/teams', data, {
      success: function (resp) {
        window.location = resp.url;
      }
    });
  },

  deleteTeam: function () {
    React.delete('/teams', { team_uuid: this.props.team_uuid }, {
      success: function () {
        window.location = '/';
      }
    });
  },

  onFeedbackClick: function () {
    React.modal.show('feedback:create');
  },

  render: function() {
    var menuFooterLink = 'menu-footer-link';
    var usersBtnClasses = menuFooterLink += (this.props.users_selected ? ' eager-select selected' : ' eager-select');

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
          <Dropdown customID={'teamSettingsDropdown'} data={this.getSettingsDropdownOptions()} ref={this.setDropdownRef} />
          <a href="javascript:void(0)" className="menu-footer-link" data-action="settings">
            <img src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/gear-white.svg"/>
          </a>
          <a href={this.props.link + '/users'} className={usersBtnClasses} data-action="users">
            <i className="fa fa-users"></i>
          </a>
          <a href="javascript:void(0)" onClick={this.onFeedbackClick} className="menu-footer-link" data-action="feedback">
            <i className="fa fa-comment"></i>
          </a>
        </div>
      </div>
    );
  }
});