var FormDoubleInput = React.createClass({

  getInitialState: function () {
    return {
      rows: this.props.data.data
    }
  },

  getRows: function () {
    var self = this;

    return this.state.rows.map(function (data) {
      return <div className="form-double-input-row" key={Math.random()}><input type="text" className={self.colClasses(0)} defaultValue={data.one} onKeyUp={self.removeInvalid} placeholder={self.props.data.placeholders[0]} /><input type="text" className={self.colClasses(1)} defaultValue={data.two} onKeyUp={self.removeInvalid} placeholder={self.props.data.placeholders[1]} />{self.getRemoveBtn()}</div>;
    });
  },

  removeInvalid: function (e) {
    $(e.target).removeClass('invalid');
  },

  getRemoveBtn: function () {
    if (!this.props.data.removeButtons) {
      return;
    }

    return <span className="remove-btn" onClick={this.removeRow}>&times;</span>;
  },

  removeRow: function (e) {
    var index = $(e.target).closest('.form-double-input-row').index();
    var newRowData = _.clone(this.state.rows);
    var removedRow = newRowData.splice(index, 1);

    if (this.props.onRemoveRow) {
      this.props.onRemoveRow(removedRow[0].id);
    }

    this.setState({ rows: newRowData });
  },

  colClasses: function (colIndex) {
    var props = ['extraFirstColClasses', 'extraSecondColClasses'];
    var classes = 'form-double-input';
    var extraClasses = this.props.data[props[colIndex]];

    if (extraClasses) {
      classes += (' ' + extraClasses.join(' '));
    }

    return classes;
  },

  addNewRow: function () {
    var currentData = this.serialize();
    currentData.push([ { one: '', two: '' } ]);
    this.setState({ rows: currentData });
  },

  serialize: function (validate) {
    return _.map($('.form-double-input-row'), function (el) {
      var inputs = $(el).find('.form-double-input');
      var $input1 = $(inputs[0]);
      var $input2 = $(inputs[1]);
      var oneVal = $input1.val().trim();
      var twoVal = $input2.val().trim();

      if (validate && !oneVal) {
        $input1.addClass('invalid');
      }

      if (validate && !twoVal) {
        $input2.addClass('invalid');
      }

      return { one: oneVal, two: twoVal, id: Math.round(Math.random() * 10000000) };
    });
  },

  render: function() {
    return (
      <div className="form-double-input-container">
        <div className="rows">{this.getRows()}</div>
        <div className="new-row-btn" onClick={this.addNewRow}>New Plan</div>
      </div>
    );
  }
});