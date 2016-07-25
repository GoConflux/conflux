var NoAddonsYetModal = React.createClass({

  hideOnConfirm: true,

  render: function() {
    return (
      <div className="no-addons-yet-modal">
        <div className="message">No Add-ons exist for this bundle yet.<br />You should add some!</div>
      </div>
    );
  }
});