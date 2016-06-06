var TeamUsersList = React.createClass({

  getInitialState: function () {
    return {
      users: this.props.users
    };
  },

  getUsers: function () {
    return this.state.users.map(function (user) {
      return <li><TeamUser data={user} /></li>;
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