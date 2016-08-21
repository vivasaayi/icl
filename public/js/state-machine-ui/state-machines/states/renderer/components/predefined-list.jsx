const React = require("react");
const _ = require('underscore');
const NetworkProxy = require('../../network-proxy');

import './predefined-list.scss';

class PredefinedList extends React.Component {
  constructor(props) {
    super(props);
    this.dataCursor = this.props.data.cursor;
    this.state = {
      listItems: null
    }
  }

  onValueChange(event) {
    this.dataCursor.set(event.target.value);
    this.dataCursor.tree.commit();
  }

  loadListItems() {
    NetworkProxy.getData('PREDEFINEDLIST', this.props.metadata.typesource)
      .then(data => {
        this.setState({
          listItems: data
        });
      });
  }

  renderItems() {
    const selectedValue = this.dataCursor.get();

    return _.map(this.state.listItems.__child['PREDEFINEDLISTITEMS'], row => {
      if (selectedValue === row.VALUE) {
        return <option value={row.VALUE} selected>{row.CAPTION}</option>;
      }
      else {
        return <option value={row.VALUE}>{row.CAPTION}</option>;
      }
    });
  }

  render() {
    if (!this.state.listItems) {
      this.loadListItems();
      return (<div className="row">
        <div className="input-field col s6 offset-s3">
          Loading Predefined list items ({this.props.metadata.typesource})...
        </div>
      </div>);
    }

    return (
      <div className="row">
        <div className="input-field col s6 offset-s3">
          <div className="row">
            {this.props.metadata.caption}
          </div>
          <div className="row">
            <select id="select" onChange={_.bind(this.onValueChange, this)} className="icl-select">
              {this.renderItems()}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = PredefinedList;