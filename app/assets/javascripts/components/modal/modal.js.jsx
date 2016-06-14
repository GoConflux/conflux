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
    }, 400);
  },

  setCurrentModal: function (ref) {
    this.currentModal = ref;
  },

  getCurrentModal: function () {
    return {
      'team:create': {
        body: <UpsertTeamModal data={this.data} isNew={true} ref={this.setCurrentModal}/>,
        confirmText: 'Create Team'
      },
      'team:update': {
        body: <UpsertTeamModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Update Team'
      },
      'team:delete': {
        body: <DeleteTeamModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, delete it.',
        declineText: 'No'
      },
      'pipeline:create': {
        body: <UpsertPipelineModal data={this.data} isNew={true} ref={this.setCurrentModal}/>,
        confirmText: 'Create Pipeline'
      },
      'pipeline:update': {
        body: <UpsertPipelineModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Update Pipeline'
      },
      'pipeline:delete': {
        body: <DeletePipelineModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, delete it.',
        declineText: 'No'
      },
      'app:create': {
        body: <UpsertAppModal data={this.data} isNew={true} ref={this.setCurrentModal}/>,
        confirmText: 'Create App'
      },
      'app:update': {
        body: <UpsertAppModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Update App'
      },
      'app:delete': {
        body: <DeleteAppModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, delete it.',
        declineText: 'No'
      },
      'addon:create': {
        body: <UpsertAddonModal data={this.data} isNew={true} ref={this.setCurrentModal}/>,
        confirmText: 'Provision'
      },
      'addon:update': {
        body: <UpsertAddonModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Update Add-on'
      },
      'addon:delete': {
        body: <DeleteAddonModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, remove it.',
        declineText: 'No'
      },
      'key:update': {
        body: <KeyUpdateModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Update Config Var'
      },
      'key:delete': {
        body: <KeyDeleteModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, remove it.',
        declineText: 'No'
      },
      'users:invite': {
        body: <InviteUsersModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Send invites'
      },
      'feedback:create': {
        body: <UserFeedbackModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Send feedback'
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

  getFooterButtons: function () {
    var currentModal = this.getCurrentModal() || {};

    if (currentModal.confirmText && currentModal.declineText) {
      return <div className="double-footer-btns"><a onClick={this.onDecline} className="modal-action-link" href="javascript:void(0)"><div className="modal-action-btn decline">{this.getDeclineText()}</div></a><a onClick={this.onConfirm} className="modal-action-link" href="javascript:void(0)"><div className="modal-action-btn confirm">{this.getConfirmText()}</div></a></div>;
    } else {
      return <a onClick={this.onConfirm} className="modal-action-link" href="javascript:void(0)"><div className="modal-action-btn confirm">{this.getConfirmText()}</div></a>;
    }
  },

  onConfirm: function () {
    if (this.currentModal) {

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