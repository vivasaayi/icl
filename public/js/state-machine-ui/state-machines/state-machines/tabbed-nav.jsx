const React = require('react');
const StateMachine = require("./state-machine.jsx");
const tabbedNavStateMachine = require('./../state-machine-definitions/tabbed-app.json');
const _ = require("underscore");

class TabbedNav extends StateMachine {
  constructor(props) {
    super(props);

    this.loadStateMachine(tabbedNavStateMachine);
  }

  renderOpenedItems() {
    return _.map(this._stateStack, state => {
      return (
        <li className="waves-effect"><a href="#!"
                                        onClick={_.bind(this.makeCurrentState, this, state)}>{state.targetItem || state.name}</a>
        </li>
      );
    })
  }

  renderStateMachine() {
    return (<div>
      <ul className="pagination">
        { this.renderOpenedItems() }
      </ul>

      <div>
        {this.renderCurrentState()}
      </div>
    </div>);
  }
}

module.exports = TabbedNav;