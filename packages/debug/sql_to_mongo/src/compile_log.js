import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';
import CodeEditor from 'react-codemirror';
import '../node_modules/codemirror/mode/javascript/javascript.js' ; 

export default class CompileLog extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let options = {
            mode: "javascript",
            theme: "base16-dark",
            lineNumbers: true
        };
        return (
            <Accordion>
                {this.props.passes.map((pass, id) => (
                    <Panel header={pass.name + " - " + pass.desc} key={id} eventKey="1">
                        <CodeEditor value={pass.output} options={options} />
                    </Panel>
                ))}
            </Accordion>
        );
    }
}
