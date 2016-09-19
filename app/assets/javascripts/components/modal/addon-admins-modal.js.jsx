var AddonAdminsModal = React.createClass({

  getInitialState: function () {
    return {
      others: this.props.data.others
    };
  },

  setEmailInputRef: function (ref) {
    this.emailInput = ref;
  },

  getOtherAdmin: function () {
    var self = this;

    return this.state.others.map(function (data) {
      return <div className="admin"><div className="email">{data.email}</div><div className="remove-btn" onClick={self.removeAdmin}>&times;</div></div>;
    });
  },

  addAdmin: function () {
    var self = this;
    var email = $(this.emailInput).val().trim();

    if (!email) {
      return;
    }

    React.post('/addons/add_admin', { addon_uuid: this.props.data.addon_uuid, email: email }, {
      success: function (data) {
        self.newAdminSuccess(data);
      }
    });
  },

  newAdminSuccess: function (data) {
    $(this.emailInput).val('');
    this.setState({ others: data.others });
  },

  // not the best way to do this right now, relying on the element's index to get the
  // user's uuid from...but doing it this way for now until react figures out how to
  // support custom attributes.
  removeAdmin: function (e) {
    var self = this;
    var adminIndex = $(e.target).closest('.admin').index() - 1;

    if (adminIndex < 0) {
      return;
    }

    var user_uuid = this.state.others[adminIndex].user_uuid;

    if (!user_uuid) {
      return;
    }

    var payload = {
      addon_uuid: this.props.data.addon_uuid,
      user_uuid: user_uuid
    };

    React.delete('/addons/remove_admin', payload, {
      success: function (data) {
        self.removeAdminSuccess(data);
      }
    });
  },

  removeAdminSuccess: function (data) {
    this.setState({ others: data.others });
  },

  render: function() {
    return (
      <div className="addon-admins-modal">
        <div className="admin-list">
          <div className="admin">
            <div className="email">{this.props.data.owner}</div>
            <div className="owner">Owner</div>
          </div>
          {this.getOtherAdmin()}
        </div>
        <div className="new-admin-container">
          <input type="text" className="new-admin-input" placeholder="New admin email" ref={this.setEmailInputRef}/>
          <a href="javascript:void(0)" className="add-new-admin-btn" onClick={this.addAdmin}>Add</a>
        </div>
      </div>
    );
  }
});