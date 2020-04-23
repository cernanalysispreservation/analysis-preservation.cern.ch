import React from "react";
import PropTypes from "prop-types";

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import axios from "axios";

class TextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ""
    };
  }

  componentDidMount() {
    axios(this.props.url).then(resp => {
      this.setState({ text: resp.data });
    });
  }

  _onChange = (data, data2, data3) => {
    console.log("ON_CHANGE:::", data, data2, data3);
  };
  render() {
    let _value;
    if (this.props.type == "json") _value = JSON.stringify(this.state.text);
    else if (this.props.type == "jsson")
      _value = JSON.stringify(this.state.text);
    else _value = this.state.text;
    return (
      <AceEditor
        mode={this.props.type}
        theme="github"
        width="100%"
        height="100%"
        name="FileEditor"
        readOnly={true}
        value={_value || ""}
        onChange={null}
        editorProps={{ $blockScrolling: true }}
      />
    );
  }
}

TextEditor.propTypes = {
  url: PropTypes.string
};

TextEditor.defaultProps = {
  url: `${process.env.PUBLIC_URL}/helloworld.pdf`
};

export default TextEditor;
