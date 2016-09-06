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
      return <div className="admin" data-uuid={data.uuid}><div className="email">{data.email}</div><div className="remove-btn" onClick={self.removeAdmin}>&times;</div></div>;
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

  removeAdmin: function (e) {
    var self = this;
    var userUuid = $(e.target).closest('.admin').attr('data-uuid');

    if (!userUuid) {
      return;
    }

    var payload = {
      addon_uuid: this.props.data.addon_uuid,
      user_uuid: userUuid
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
          <div className="add-new-admin-btn" onClick={this.addAdmin}>Add</div>
        </div>
      </div>
    );
  }
});