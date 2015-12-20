import React from 'react';
import CodeEditor from 'react-codemirror';

import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple'; 

import { mode } from 'llqm-frontend-sql';
CodeMirror.defineSimpleMode("llqm-frontend-sql", mode);

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "SELECT cpn.id, cpn.from\nFROM docs\nUNNEST coupons AS cpn"
        };
    }
    updateCode(code) {
        this.setState({
            code: code
        });
    }
    render() {
        let options = {
            mode: "llqm-frontend-sql",
            theme: "base16-dark",
            lineNumbers: true
        };
        return <CodeEditor value={this.state.code} options={options} />
    }
}
