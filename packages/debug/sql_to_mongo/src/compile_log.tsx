/// <reference path="./react-object-inspector.d.ts"/>

import * as React from 'react';
import {Panel, PanelGroup, ListGroup, ListGroupItem} from 'react-bootstrap';
import * as ObjectInspector from 'react-object-inspector';

import {IDebugResult} from 'llqm-core';

interface Props {
    result? : IDebugResult,
    key? : string,
    open? : boolean
}

export default class CompileLog extends React.Component<Props, void> {
    constructor(props : Props) {
        super(props);
    }
    render() : JSX.Element {
        let result = this.props.result;
        return (
            <Panel collapsible defaultExpanded={this.props.open} header={result.name} bsStyle={result.success ? "success" : "danger"}>
                <ListGroup fill>
                    <ListGroupItem>
                        <ObjectInspector data={result.output} />
                    </ListGroupItem>
                    <ListGroupItem>
                        <PanelGroup>
                            {result.sub_results.map((res, id) => <CompileLog result={res} key={result.name + id}/>)}
                        </PanelGroup>
                    </ListGroupItem>
                </ListGroup>
            </Panel>
        );
    }
}
