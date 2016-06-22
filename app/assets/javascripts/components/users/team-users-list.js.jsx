var TeamUsersList = React.createClass({

  getInitialState: function () {
    return {
      users: this.props.users
    };
  },

  getUsers: function () {
    var self = this;

    return this.state.users.map(function (user) {
      return <li><TeamUser data={user} cuCanEdit={self.props.cuCanEdit} updateUsersList={self.props.updateUsersList} /></li>;
    });
  },

  render: function() {
    return (
      <div>
        <ul id="teamUsersList">{this.getUsers()}</ul>
      </div>
    );
  }
});