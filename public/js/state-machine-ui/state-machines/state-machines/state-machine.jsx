'use strict';

const _ = require("underscore");
const React = require('react');

class StateMachine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentState: null,
      key: 0
    };

    this.registeredStates = this.props.registeredStates;

    this.props.dataCursor.set('stateData', {});
    this.props.dataCursor.tree.commit();
    this._stateDataCurstor = this.props.dataCursor.select('stateData');

    this._stateStack = [];
    this._stateDefinitions = {};

    this._states = [];
    this._stateMachineDefinition = null;
  }

  getKey() {
    this.state.key += 1;
    return this.state.key;
  }

  loadStateMachine(stateMachineDefinition) {
    console.log("Loading State Machine..." + stateMachineDefinition.name);

    this._stateMachineDefinition = stateMachineDefinition;

    _.each(this._stateMachineDefinition.states, state => {
      this._stateDefinitions[state.name] = state;
    });

    this.goToInitialState();
  }

  onActionPerformed(actionName, targetItem, data) {
    const actionDefinition = _.find(this.state.currentState.actions, action => {
      return action.name === actionName;
    });

    if (actionDefinition.hasOwnProperty('targetState')) {
      this.goToState(this._stateDefinitions[actionDefinition.targetState], targetItem, data);
    }
    else if (actionName === 'smGoBack') {
      this._stateStack.pop();
      this.setCurrentState(this._stateStack[this._stateStack.length - 1]);
    }
  }

  goToInitialState() {
    let initialState = this._stateMachineDefinition.initialState;
    this.goToState(this._stateDefinitions[initialState]);
  }

  addState(stateDefinition) {
    this._stateMachineDefinition.states.push(stateDefinition);
  }

  goToState(state, targetItem, data) {
    const clonedState = _.extend({}, state);
    clonedState.id = this._stateStack.length + 1 + '';
    clonedState.targetItem = targetItem || state.targetItem || this.props.stateDefinition.targetItem;
    clonedState.data = data || state.data || {};
    clonedState.dataTree = this.dataTree;

    this._stateDataCurstor.set(clonedState.id, {});
    this._stateDataCurstor.tree.commit();

    clonedState.dataCursor = this._stateDataCurstor.select(clonedState.id);
    this._stateStack.push(clonedState);
    this.setCurrentState(clonedState);
  }

  makeCurrentState(state) {
    this.setCurrentState(state);
  }

  setCurrentState(state) {
    this.state.currentState = state;

    this.setState({
      currentState: state
    })
  }

  render() {
    return this.renderStateMachine();
  }

  renderCurrentState() {
    if (this.state.currentState) {
      const Ui = this.registeredStates[this.state.currentState.name];
      return (<Ui key={this.getKey()} onActionPerformed={_.bind(this.onActionPerformed, this)}
                  dataCursor={this.state.currentState.dataCursor} stateDefinition={this.state.currentState}
                  registeredStates={this.registeredStates}/>);
    }
    return <div>No Initial States</div>;
  }
}

module.exports = StateMachine;