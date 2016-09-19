var Modal = React.createClass({

  data: {},

  options: {},

  allowConfirm: true,

  getInitialState: function () {
    return {
      usecase: 'empty',
      extraDialogClasses: []
    };
  },

  componentWillMount: function () {
    React.modal = this;
  },

  componentDidMount: function () {
    var self = this;

    $('#confluxModal').on('hidden.bs.modal', function () {
      setTimeout(function () {
        if (self.currentModal.onHide) {
          self.currentModal.onHide();
          self.setState({ usecase: 'empty', extraDialogClasses: [] });
        }
      }, 400);
    });

    $('#confluxModal').on('shown.bs.modal', function () {
      $('[data-react-class=Modal]').width($('.modal-dialog').width());
    });
  },

  show: function (usecase, data, options) {
    this.data = data || {};
    this.options = options || {};
    var extraDialogClasses = this.options.extraDialogClasses || [];

    this.setState({ usecase: usecase, extraDialogClasses: extraDialogClasses });

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
        headerText: 'New Bundle'
      },
      'app:update': {
        body: <UpsertAppModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Save',
        headerText: 'Edit Bundle'
      },
      'app:delete': {
        body: <DeleteAppModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes, delete it.',
        declineText: 'No',
        headerText: 'Delete Bundle'
      },
      'app:clone': {
        body: <CloneAppModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Clone',
        headerText: 'Clone Bundle'
      },
      'app:no-addons': {
        body: <NoAddonsYetModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Okay',
        headerText: 'Clone Bundle',
        hideLoadingAnimation: true
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
        headerText: 'Remove Service'
      },
      'addon:suggest': {
        body: <SuggestAddonModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Submit',
        headerText: 'Suggest a Service'
      },
      'addon:admins': {
        body: <AddonAdminsModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Add as Admin',
        headerText: 'Manage Admins',
        hideFooterBtn: true
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
        body: <UpsertTeamUserModal data={this.data} isNew={true} ref={this.setCurrentModal}/>,
        confirmText: 'Send invitation',
        headerText: 'New Member'
      },
      'users:update': {
        body: <UpsertTeamUserModal data={this.data} isNew={false} ref={this.setCurrentModal}/>,
        confirmText: 'Save',
        headerText: 'Edit Team Member'
      },
      'users:delete': {
        body: <DeleteTeamUserModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Yes',
        declineText: 'No',
        headerText: 'Remove Team Member'
      },
      'feedback:create': {
        body: <UserFeedbackModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Submit',
        headerText: 'Give Feedback to Conflux'
      },
      'password:forgot': {
        body: <ForgotPasswordModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Send email',
        headerText: 'Forgot Password'
      },
      'like-service:unauthed': {
        body: <ActionRequiresAuthModal data={this.data} ref={this.setCurrentModal}/>,
        confirmText: 'Login'
      },
      'empty': {
        body: <div></div>,
        confirmText: '',
        headerText: ''
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
    var confirmClasses = 'modal-action-btn confirm';
    var confirmText = this.getConfirmText();
    this.enableConfirm();

    if (currentModal.hideFooterBtn) {
      return;
    }
    
    if (currentModal.confirmText && currentModal.declineText) {
      return <div className="double-footer-btns"><a onClick={this.onDecline} className="modal-action-link" href="javascript:void(0)"><div className="modal-action-btn decline">{this.getDeclineText()}</div></a><a onClick={this.onConfirm} className="modal-action-link" href="javascript:void(0)"><div className="modal-action-btn confirm">{this.getConfirmText()}</div><HorizontalSpinner ref={this.setSpinnerRef} /></a></div>;
    } else {
      this.hideLoadingAnimation = !!currentModal.hideLoadingAnimation;

      // hardcoding cause fuck it
      if (this.state.usecase == 'addon:update' && this.data.plans[this.data.selectedIndex].disabled == 'true') {
        confirmClasses += ' plan-na';
        confirmText = <span><i className="fa fa-lock lock-icon"></i>Plan not currently available</span>;
        this.disableConfirm();
      }

      if (this.state.usecase == 'addon:create' && _.contains(this.data.addonsMap['0'], this.data.addon_uuid)) {
        confirmClasses += ' scope-na';
        confirmText = <span><i className="fa fa-lock lock-icon"></i>Service already exists for this scope</span>;
        this.disableConfirm();
      }

      return <a onClick={this.onConfirm} className="modal-action-link" href="javascript:void(0)"><div className={confirmClasses}>{confirmText}</div><HorizontalSpinner ref={this.setSpinnerRef} /></a>;
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
    if (!this.allowConfirm) {
      return;
    }

    if (this.currentModal.validate) {
      var valid = this.currentModal.validate();

      if (!valid) {
        return;
      }
    }

    if (!this.hideLoadingAnimation) {
      this.showSpinner();
    }

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

  enableConfirm: function () {
    this.allowConfirm = true;
  },

  disableConfirm: function () {
    this.allowConfirm = false;
  },

  render: function() {
    var dialogClasses = 'modal-dialog';

    this.state.extraDialogClasses.forEach(function (className) {
      dialogClasses += (' ' + className);
    });

    return (
      <div className={dialogClasses}>
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