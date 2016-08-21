const React = require('react');
const _ = require("underscore");

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  doStateMachineAction(action, targetItem, data) {
    this.props.onActionPerformed(action, targetItem, data);
  }

  render() {
    return (
      <div className="row">
        <div className="col m12">
          <div className="card-panel">
          <span className="teal-text center">
            <h2>Keep up the spirit!</h2>
          </span>
          </div>
        </div>
        <div className="col m3">
          <div className="card-panel teal">
          <span className="white-text" onClick={ _.bind(this.doStateMachineAction, this, 'smOpenList', 'LYRICS', {})}>
            <h2>Lyrics</h2>
          </span>
          </div>
        </div>
        <div className="col m3">
          <div className="card-panel teal">
          <span className="white-text" onClick={ _.bind(this.doStateMachineAction, this, 'smOpenList', 'PROMISES', {})}>
            <h2>Promises</h2>
          </span>
          </div>
        </div>
        <div className="col m3">
          <div className="card-panel teal">
          <span className="white-text" onClick={ _.bind(this.doStateMachineAction, this, 'smOpenList', 'Churches', {})}>
            <h2>Churches</h2>
          </span>
          </div>
        </div>
        <div className="col m3">
          <div className="card-panel teal">
          <span className="white-text" onClick={ _.bind(this.doStateMachineAction, this, 'smOpenList', 'EVENTS', {})}>
            <h2>Events</h2>
          </span>
          </div>
        </div>
        <div className="col m12">
          <div className="card-panel">
          <span className="teal-text center"
                onClick={ _.bind(this.doStateMachineAction, this, 'smOpenList', 'PREDEFINEDLIST', {})}>
            <h2>Predefined Lists</h2>
          </span>
          </div>
        </div>
      </div>);
  }
}

module.exports = Dashboard;