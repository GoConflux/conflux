var Modal = React.createClass({

  data: {},

  options: {},

  getInitialState: function () {
    return {
      usecase: 'addon:create'
    };
  },

  componentWillMount: function () {
    React.modal = this;
  },

  componentDidMount: function () {
    var self = this;

    try {
      $('#confluxModal').on('hidden.bs.modal', function () {
        setTimeout(function () {
          if (self.currentModal.onHide) {
            self.currentModal.onHide();
          }
        }, 400);
      });
    } catch (e) {}
  },

  show: function (usecase, data, options) {
    this.data = data || {};
    this.options = options || {};

    this.setState({ usecase: usecase });

    $('#confluxModal').modal('show');
  },

  hide: function () {
    var self = this;
    $('#confluxModal').modal('hide');

    setTimeout(function () {
      if (self.currentModal.onHide) {
        self.currentModal.onHide();
      }

      self.hideSpinner();
    }, 400);
  },

  setCurrentModal: function (ref) {
    this.currentModal = ref;
  },

  getCurrentModal: function () {
    return {
      'team:create': {
        body: <UpsertTeamModal data={this.data} isNew={true} ref={this.setCurrentModal}/>,
        confirmText: 'Create',
        headerText: 'New Team'
      },
      'team:update': {
        body: <UpsertTeamModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Save',
        headerText: 'Edit Team'
      },
      'team:delete': {
        body: <DeleteTeamModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, delete it.',
        declineText: 'No',
        headerText: 'Delete Team'
      },
      'pipeline:create': {
        body: <UpsertPipelineModal data={this.data} isNew={true} ref={this.setCurrentModal}/>,
        confirmText: 'Create',
        headerText: 'New Pipeline'
      },
      'pipeline:update': {
        body: <UpsertPipelineModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Save',
        headerText: 'Edit Pipeline'
      },
      'pipeline:delete': {
        body: <DeletePipelineModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, delete it.',
        declineText: 'No',
        headerText: 'Delete Pipeline'
      },
      'app:create': {
        body: <UpsertAppModal data={this.data} isNew={true} ref={this.setCurrentModal}/>,
        confirmText: 'Create',
        headerText: 'New App'
      },
      'app:update': {
        body: <UpsertAppModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Save',
        headerText: 'Edit App'
      },
      'app:delete': {
        body: <DeleteAppModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, delete it.',
        declineText: 'No',
        headerText: 'Delete App'
      },
      'addon:create': {
        body: <UpsertAddonModal data={this.data} isNew={true} ref={this.setCurrentModal}/>,
        confirmText: 'Provision'
      },
      'addon:update': {
        body: <UpsertAddonModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Update'
      },
      'addon:delete': {
        body: <DeleteAddonModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, remove it.',
        declineText: 'No',
        headerText: 'Remove Add-on'
      },
      'key:update': {
        body: <KeyUpdateModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Save',
        headerText: 'Edit Config Var'
      },
      'key:delete': {
        body: <KeyDeleteModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, remove it.',
        declineText: 'No',
        headerText: 'Delete Config Var'
      },
      'users:invite': {
        body: <InviteUsersModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Send invites',
        headerText: 'New Members'
      },
      'feedback:create': {
        body: <UserFeedbackModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Submit',
        headerText: 'Give Feedback to Conflux'
      }
    }[this.state.usecase];
  },

  getBody: function () {
    return (this.getCurrentModal() || {}).body;
  },

  getConfirmText: function () {
    return (this.getCurrentModal() || {}).confirmText;
  },

  getDeclineText: function () {
    return (this.getCurrentModal() || {}).declineText;
  },

  getHeaderText: function () {
    return (this.getCurrentModal() || {}).headerText;
  },

  getFooterButtons: function () {
    var currentModal = this.getCurrentModal() || {};

    if (currentModal.confirmText && currentModal.declineText) {
      return <div className="double-footer-btns"><a onClick={this.onDecline} className="modal-action-link" href="javascript:void(0)"><div className="modal-action-btn decline">{this.getDeclineText()}</div></a><a onClick={this.onConfirm} className="modal-action-link" href="javascript:void(0)"><div className="modal-action-btn confirm">{this.getConfirmText()}</div><HorizontalSpinner ref={this.setSpinnerRef} /></a></div>;
    } else {
      return <a onClick={this.onConfirm} className="modal-action-link" href="javascript:void(0)"><div className="modal-action-btn confirm">{this.getConfirmText()}</div><HorizontalSpinner ref={this.setSpinnerRef} /></a>;
    }
  },

  setSpinnerRef: function (ref) {
    this.spinner = ref;
  },

  showSpinner: function () {
    $('.modal-action-btn.confirm').css('color', 'rgba(0,0,0,0)');
    this.spinner.showSpinner();
  },

  hideSpinner: function () {
    $('.modal-action-btn.confirm').css('color', 'white');
    this.spinner.hideSpinner();
  },

  onConfirm: function () {
    if (this.currentModal.validate) {
      var valid = this.currentModal.validate();

      if (!valid) {
        return;
      }
    }

    this.showSpinner();

    if (this.currentModal.onConfirm) {
      this.currentModal.onConfirm();
    }

    if (this.options.onConfirm) {
      var data;

      if (this.currentModal.serialize) {
        data = this.currentModal.serialize();
      }

      this.options.onConfirm(data);
    }

    if (this.currentModal.hideOnConfirm) {
      this.hide();
    }
  },

  onDecline: function () {
    if (this.currentModal && this.currentModal.onDecline) {
      this.currentModal.onDecline();
    }

    this.hide();
  },

  render: function() {
    return (
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-header-title">{this.getHeaderText()}</div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {this.getBody()}
          </div>
          <div className="modal-footer">
            {this.getFooterButtons()}
          </div>
        </div>
      </div>
    );
  }
});