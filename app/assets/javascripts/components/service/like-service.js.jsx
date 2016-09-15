var LikeService = React.createClass({

  getInitialState: function () {
    return {
      count: this.props.count,
      hasLiked: this.props.authed && this.props.hasLiked
    }
  },

  likeIconClasses: function () {
    var classes = 'likes-icon fa';

    if (this.state.hasLiked) {
      classes += ' fa-heart has-liked';
    } else {
      classes += ' fa-heart-o';
    }

    return classes;
  },

  onLikeClick: function () {
    var self = this;

    if (!this.props.authed) {
      React.modal.show('like-service:unauthed', {
        message: 'You must be logged into your Conflux account in order to like a service.'
      });

      return;
    }

    var endpoint = this.state.hasLiked ? 'unlike' : 'like';

    React.post('/addons/' + endpoint, { addon_uuid: this.props.addonUuid }, {
      success: function (data) {
        var newLikedState = !self.state.hasLiked;

        self.setState({
          count: data.count,
          hasLiked: newLikedState
        });
      }
    });
  },

  render: function() {
    return (
      <div className="likes" onClick={this.onLikeClick}>
        <i className={this.likeIconClasses()}></i>
        <div className="likes-count">{this.state.count}</div>
      </div>
    );
  }
});