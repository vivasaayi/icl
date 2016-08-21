const React = require('react');
const _ = require("underscore");

class GenericState extends React.Component {
  constructor(props) {
    super(props);
    this.registeredStates = this.props.registeredStates;
    this.stateDefinition = this.props.stateDefinition;
  }

  doStateMachineAction(action, targetItem, data) {
    alert(action + targetItem, data);
    this.props.onActionPerformed(action, targetItem, data);
  }

  render() {
    const Ui = this.registeredStates[this.stateDefinition.targetItem];

    return (<Ui {...this.props}/>);
  }
}

module.exports = GenericState;