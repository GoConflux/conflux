var FormDoubleInput = React.createClass({

  getInitialState: function () {
    return {
      rows: this.props.data.data
    }
  },

  setContainerRef: function (ref) {
    this.container = ref;
  },

  setNewRowBtnRef: function (ref) {
    this.newRowBtn = ref;
  },

  getRows: function () {
    var self = this;

    return this.state.rows.map(function (data) {
      return <div className="form-double-input-row" key={Math.random()}>{self.firstInput(data)}{self.secondInput(data)}{self.getRemoveBtn()}</div>;
    });
  },
  
  firstInput: function (data) {
    if (this.props.data.firstDollar) {
      return <DollarInput classes={this.colClasses(0)} val={data.one} placeholder={this.props.data.placeholders[0]} onKeyUp={this.removeInvalid} />;
    } else {
      return <input type="text" className={this.colClasses(0)} defaultValue={data.one} onKeyUp={this.removeInvalid} onBlur={this.onBlurFirstCol} placeholder={this.props.data.placeholders[0]} />;
    }
  },

  secondInput: function (data) {
    if (this.props.data.secondDollar) {
      return <DollarInput classes={this.colClasses(1)} val={data.two} placeholder={this.props.data.placeholders[1]} onKeyUp={this.removeInvalid} />;
    } else {
      return <input type="text" className={this.colClasses(1)} defaultValue={data.two} onKeyUp={this.removeInvalid} onBlur={this.onBlurSecondCol} placeholder={this.props.data.placeholders[1]} />;
    }
  },

  onBlurFirstCol: function (e) {
    if (this.props.onBlurFirstCol) {
      var index = $(e.target).closest('.form-double-input-row').index();
      this.props.onBlurFirstCol($(e.target).val().trim(), this.state.rows[index].id);
    }
  },

  onBlurSecondCol: function (e) {
    if (this.props.onBlurSecondCol) {
      var index = $(e.target).closest('.form-double-input-row').index();
      this.props.onBlurSecondCol($(e.target).val().trim(), this.state.rows[index].id);
    }
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
    var rowsData = this.serialize(null, false).value;
    var removedRow = rowsData.splice(index, 1);

    if (this.props.onRemoveRow) {
      this.props.onRemoveRow(removedRow[0].id);
    }

    this.setState({ rows: rowsData });
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

  emptyRow: function () {
    return {
      one: '',
      two: '',
      id: Math.round(Math.random() * 1000000).toString()
    };
  },

  addNewRow: function () {
    var rowsData = this.serialize(null, false).value;
    var emptyRowData = this.emptyRow();

    rowsData.push(emptyRowData);

    $(this.newRowBtn).removeClass('invalid');

    this.setState({ rows: rowsData });

    if (this.props.onNewRow) {
      this.props.onNewRow(emptyRowData.id);
    }
  },

  serialize: function (cb, validate) {
    var self = this;
    var data = [];
    var valid = true;

    if (validate == null) {
      validate = this.props.required;
    }

    _.each($(this.container).find('.form-double-input-row'), function (el, i) {
      var inputs = $(el).find('.form-double-input');
      var $input1 = $(inputs[0]);
      var $input2 = $(inputs[1]);
      var oneVal = $input1.val().trim();
      var twoVal = $input2.val().trim();

      if (validate && !oneVal) {
        $input1.addClass('invalid');
        valid = false;
      }

      if (validate && !twoVal) {
        $input2.addClass('invalid');
        valid = false;
      }

      data.push({
        one: oneVal,
        two: twoVal,
        id: self.state.rows[i].id
      });
    });

    if (validate && _.isEmpty(data)) {
      $(this.newRowBtn).addClass('invalid');
      valid = false;
    }

    var payload = { valid: valid, value: data };

    if (!cb) {
      return payload;
    }

    cb(payload);
  },

  render: function() {
    return (
      <div className="form-double-input-container" ref={this.setContainerRef}>
        <div className="rows">{this.getRows()}</div>
        <div className="new-row-btn" onClick={this.addNewRow} ref={this.setNewRowBtnRef}>{this.props.data.newRowName || 'New Row'}</div>
      </div>
    );
  }
});