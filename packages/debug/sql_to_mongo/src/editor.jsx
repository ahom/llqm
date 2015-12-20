import React from 'react';
import Codemirror from 'react-codemirror';

import { mode } from 'llqm-frontend-sql';

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "SELECT cpn.id, cpn.from\nFROM docs\nUNNEST coupons AS cpn"
        };
        // TODO: Codemirror.defineSimpleMode("llqm-frontend-sql", mode);
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
        return <Codemirror value={this.state.code} options={options} />
    }
}
