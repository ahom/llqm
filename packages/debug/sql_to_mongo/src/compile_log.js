import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';

export default class CompileLog extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Accordion>
                {this.props.compiler.pipeline().map((pass, id) => (
                    <Panel header={pass.name + " - " + pass.desc} key={id} eventKey="1">
                        test text
                    </Panel>
                ))}
            </Accordion>
        );
    }
}
