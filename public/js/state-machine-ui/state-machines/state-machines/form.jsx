const React = require('react');
const StateMachine = require("./state-machine.jsx");
const formStateMachine = require('./../state-machine-definitions/form.json');
const _ = require("underscore");

class Form extends StateMachine {
  constructor(props) {
    super(props);

    this.loadStateMachine(formStateMachine);
  }

  renderStateMachine() {
    return (
      <div>
        {this.renderCurrentState()}
      </div>);
  }
}

module.exports = Form;