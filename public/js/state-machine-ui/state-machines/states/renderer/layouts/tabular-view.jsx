const React = require('react');
const _ = require("underscore");

class TabularView extends React.Component {
  constructor(props) {
    super(props);

    this.data = props.data;
    this.columns = props.tableDefinition.columns;
  }

  doStateMachineAction(action, targetItem, data) {
    this.props.onActionPerformed(action, targetItem, data);
  }

  viewItem(rowData) {

    alert(JSON.stringify(rowData));
  }

  editItem(rowData) {
    this.doStateMachineAction('smOpenItem', this.props.tableDefinition.name, { recordId: rowData._id });
  }

  deleteItem(rowData) {
    this.props.deleteItem(rowData);
  }

  renderEditDeleteLinks(rowData) {
    return (<td>
      <a href="#" onClick={_.bind(this.viewItem, this, rowData)}>View</a> |
      <a href="#" onClick={_.bind(this.editItem, this, rowData)}>Edit</a> |
      <a href="#" onClick={_.bind(this.deleteItem, this, rowData)}>Delete</a></td>)
  }

  renderRow(rowData) {
    const renderedRow = _.map(this.columns, column => {
      return <td>{rowData[column.name]}</td>
    });

    renderedRow.push(this.renderEditDeleteLinks(rowData));

    return renderedRow;
  }

  renderRows() {
    return _.map(this.data, (rowData, index) => {
      return (<tr key={index}>
        <td>{rowData['_id']}</td>
        { this.renderRow(rowData) }
      </tr>);
    });
  }

  renderHeaders() {
    var columns = _.map(this.columns, column => {
      return <th>{column.caption}</th>
    });

    columns.push(<th>CRUD</th>);

    return columns;
  }

  render() {
    return (
      <table className="bordered">
        <thead>
        <tr>
          <th>_ID</th>
          {this.renderHeaders()}
        </tr>
        </thead>

        <tbody>
        {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

module.exports = TabularView;