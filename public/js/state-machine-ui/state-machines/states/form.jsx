const StateMachine = require("./../state-machines/state-machine.jsx");
const React = require('react');
const _ = require("underscore");
const Components = require('./renderer/components/index.js');
const TabularView = require('./renderer/layouts/tabular-view.jsx');
const NetworkProxy = require('./network-proxy');

import './form.scss';

class Form extends StateMachine {
  constructor(props) {
    super(props);

    this.stateDefinition = this.props.stateDefinition;

    this.state = {
      tableName: this.stateDefinition.targetItem,
      tableDefinition: null,
      recordId: this.stateDefinition.data.recordId,
      parentRecordId: this.stateDefinition.data.parentRecordId,
      isList: (this.stateDefinition.data.recordId || this.stateDefinition.data.mode === 'add') ? false : true,
      isCreateMode: this.stateDefinition.data.mode === 'add'
    }

    this.cursors = {};
    this.controlsRendered = false;
  }

  getData() {
    if (!this.state.isCreateMode) {
      return NetworkProxy.getData(this.state.tableName, this.state.recordId, true);
    }
    return Promise.resolve({});
  }

  fetchTableDefinition() {
    this.getData()
      .then(data => {
        this.stateDefinition.dataCursor.set(data);
        this.stateDefinition.dataCursor.tree.commit();

        NetworkProxy.getTableDefinition(this.state.tableName, true)
          .then(tableDefinitions => {
            this.setState({
              tableDefinition: tableDefinitions[this.state.tableName],
              tableDefinitions: tableDefinitions
            });
          });
      })
  }

  saveForm() {
    if (this.state.isCreateMode) {
      if (this.state.parentRecordId) {
        this.stateDefinition.dataCursor.set('_parent', this.state.parentRecordId);
        this.stateDefinition.dataCursor.tree.commit();
      }
      NetworkProxy.createRecord(this.state.tableName, this.stateDefinition.dataCursor.get())
        .then(data => {
          this.doStateMachineAction('smGoBack');
        });
    }
    else {
      NetworkProxy.updateRecord(this.state.tableName, this.stateDefinition.dataCursor.get())
        .then(data => {
          this.progress(false);
        });
    }
    this.progress(true);
  }

  progress(flag) {
    this.setState({
      progress: flag
    })
  }

  goBack() {
    this.doStateMachineAction('smGoBack');
  }

  addNewItem() {
    this.doStateMachineAction('smOpenItem', this.state.tableName, {
      mode: 'add'
    });
  }

  addNewChildRecord(tableName) {
    this.doStateMachineAction('smOpenItem', tableName, {
      mode: 'add',
      parentRecordId: this.stateDefinition.dataCursor.get()._id
    })
  }

  doStateMachineAction(action, targetItem, data) {
    this.props.onActionPerformed(action, targetItem, data);
  }

  getHeader() {
    if (this.state.isCreateMode) {
      return 'Create New';
    }
    else {
      const data = this.stateDefinition.dataCursor.get();
      return 'Edit ' + data[this.state.tableDefinitions[this.state.tableName].identifier];
    }
  }

  renderChildren() {

    return _.map(this.state.tableDefinitions[this.state.tableName].columns, column => {
      const Element = Components[column.type];
      const data = {
        cursor: this.stateDefinition.dataCursor.select(column.name)
      };
      return <Element data={data} metadata={column}/>
    });
  }

  renderChildTables() {
    if (this.state.isCreateMode) {
      return;
    }

    const data = this.stateDefinition.dataCursor.get();
    const childData = data.hasOwnProperty('__child') ? data.__child : {};

    return _.map(this.state.tableDefinitions[this.state.tableName].children, (childTable, index) => {
      return (<div className="row">
        <div className="col s10 offset-s1">
          <div className="brown lighten-5">
            <h4 className="form-heading">{this.state.tableDefinitions[childTable].caption}</h4>
            <i className="medium material-icons right icl-link"
               onClick={_.bind(this.addNewChildRecord, this, childTable)}>add</i>
          </div>

          <TabularView {...this.props} data={childData[childTable]}
                                       tableDefinition={this.state.tableDefinitions[childTable]}
                                       deleteItem={this.deleteItem.bind(this, childTable)}/>
        </div>
      </div>);
    });
  }

  renderTabularView() {
    return <TabularView {...this.props} data={this.stateDefinition.dataCursor.get()}
                                        tableDefinition={this.state.tableDefinitions[this.state.tableName]}
                                        deleteItem={this.deleteItem.bind(this, this.state.tableName)}/>;
  }

  deleteItem(tableName, rowData) {
    NetworkProxy.deleteRecord(tableName, rowData._id)
      .then(result => {
        this.progress(false);
      });
    this.progress(true);
  }

  renderProgress() {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>);
  }

  renderProgressOnSave() {
    if (this.state.progress) {
      return this.renderProgress();
    }
  }

  getInputs(behaviour) {
    var inputs = {};

    _.each(behaviour.inputs, input => {
      var path = input.path.split('/');

      if (path[0] === 'data') {
        inputs[input.name] = this.stateDefinition.dataCursor.get()[path[1]];
      }
    });

    return inputs;
  }

  setOutputs(behaviour, outputs) {
    _.each(behaviour.outputs, output => {
      var path = output.path.split('/');

      if (path[0] === 'data') {
        this.stateDefinition.dataCursor.set(path[1], outputs[output.data]);
      }
    })
  }

  executeBehaviour(behaviour) {
    if (!this.controlsRendered) return;

    var outputs = {};
    var inputs = this.getInputs(behaviour);

    behaviour.behaviour(inputs, outputs);

    this.setOutputs(behaviour, outputs);
  }

  bindChangeEvent(path, behaviour) {
    var path = path.split('/');


    if (path[0] === 'data') {
      var cursor = this.stateDefinition.dataCursor.select(path[1]);
      this.cursors[path[1]] = cursor;

      cursor.on('update', _.bind(this.executeBehaviour, this, behaviour));
    }
    else {

    }
  }

  attachBehaviours() {
    const behaviour = NetworkProxy.getBehaviour(this.state.tableName);

    if (!behaviour) return;

    behaviour.triggers.forEach(trigger => {
      if (trigger.event === 'change') {
        this.bindChangeEvent(trigger.path, behaviour);
      }
    });
  }

  finishRendering() {
    this.controlsRendered = true;
  }

  render() {
    if (!this.state.tableDefinitions) {
      this.fetchTableDefinition();
      return this.renderProgress();
    }

    if (this.state.isList) {
      return (<div>
        <table className="brown lighten-5">
          <tr>
            <td><i className="medium material-icons icl-link" onClick={_.bind(this.goBack, this)}>arrow_back</i></td>
            <td className="center"><h4>{this.state.tableDefinition.caption}</h4></td>
            <td><i className="medium material-icons right icl-link" onClick={_.bind(this.addNewItem, this)}>add</i></td>
          </tr>
        </table>

        {this.renderTabularView()}

      </div>);
    }

    this.attachBehaviours();

    return (
      <div>
        <table className="brown lighten-5">
          <tr>
            <td><i className="medium material-icons icl-link" onClick={_.bind(this.goBack, this)}>arrow_back</i></td>
            <td className="center"><h4>{this.getHeader()} ({this.state.tableDefinition.caption})</h4></td>
            <td><i className="medium material-icons right icl-link" onClick={_.bind(this.saveForm, this)}>save</i>
            </td>
          </tr>
        </table>

        {this.renderProgressOnSave()}
        {this.renderChildren()}
        {this.renderChildTables()}
        {this.finishRendering()}

      </div>
    );
  }
}

module.exports = Form;