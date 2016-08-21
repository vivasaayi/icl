const React = require("react");
const _ = require('underscore');

class Text extends React.Component {
  constructor(props) {
    super(props);
    this.dataCursor = this.props.data.cursor;
  }

  onValueChange(event) {
    this.dataCursor.set(event.target.value);
    this.dataCursor.tree.commit();
    this.forceUpdate();
  }

  render() {
    return (
      <div className="row">
        <div className="input-field col s6 offset-s3">
          <input id="first_name2" type="number" className="validate" value={this.dataCursor.get()}
                 onChange={_.bind(this.onValueChange, this)}/>
          <label className="active" htmlFor="first_name2">{this.props.metadata.caption}</label>
        </div>
      </div>
    );
  }
}

module.exports = Text;