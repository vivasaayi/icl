const React = require('react');
const ReactDOM = require('react-dom');
const RegisteredStates = require('./state-machines/states/index.js');
const DataTree = require('baobab');

import '../../../node_modules/materialize-css/sass/materialize.scss';
import './site.scss';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.TabbedNav = RegisteredStates['tabbed-nav'];
    this.dataTree = new DataTree({
      stateMachine: {}
    });
  }

  render() {
    return (
      <div>
        <nav className="brown darken-3">
          <div className="nav-wrapper">
            <a href="#" className="brand-logo left">Indian Christian Literature</a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="">Me</a></li>
            </ul>
          </div>
        </nav>

        <this.TabbedNav registeredStates={RegisteredStates} dataCursor={this.dataTree.select('stateMachine')}/>
      </div>
    );
  }
}

ReactDOM.render(<Index name="John"/>, document.getElementById('app'));