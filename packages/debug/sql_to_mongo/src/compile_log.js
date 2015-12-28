import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';
import JsonInspector from 'react-json-inspector';

export default class CompileLog extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Accordion>
                {this.props.passes.map((pass, id) => (
                    <Panel header={pass.name + " - " + pass.desc} key={id} bsStyle={pass.success ? "success" : "danger"} eventKey="1">
                        <JsonInspector data={pass.output} />
                    </Panel>
                ))}
            </Accordion>
        );
    }
}
