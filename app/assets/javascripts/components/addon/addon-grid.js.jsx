var AddonGrid = React.createClass({

  getInitialState: function () {
    return {
      addons: this.props.addons || []
    }
  },

  // Ugh --> figure out how to do this not so nasty when you actually have time. - Ben W.
  formatAddons: function () {
    if (this.state.addons.length == 0) {
      if (this.props.writeAccess) {
        return this.props.personal ?
          <div className="no-addons-view">You currently don't have any personal services for this bundle.<br />Use the search above to add some.</div> :
          <div className="no-addons-view">No shared services exist yet for this bundle.<br />Use the search above to add some.</div>;
      } else {
        return <div className="no-addons-view no-write-access">No shared services exist yet for this bundle.</div>;
      }
    } else {
      return this.state.addons.map(function (addon) {
        return <div className="addon-wrapper"><Addon data={addon} /></div>;
      });
    }
  },

  getGroupName: function () {
    return !!this.props.group ? <span className="addon-grid-title">{this.props.group}</span> : null;
  },

  render: function() {
    var classes = 'addon-grid';

    // if you don't have write access, the personal add-ons grid won't exist, so give the addon-grid some min-height
    if (!this.props.writeAccess) {
      classes += ' no-personal';
    }

    return (
      <div className={classes}>
        {this.getGroupName()}
        {this.formatAddons()}
      </div>
    );
  }
});