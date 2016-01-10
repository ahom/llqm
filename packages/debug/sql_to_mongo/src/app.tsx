import * as React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

import {Compiler, IDebugResult} from 'llqm-core';
import {default as SqlFrontend} from 'llqm-frontend-sql';
import {default as MongoBackend} from 'llqm-backend-mongo';

import Editor from './editor';
import CompileLog from './compile_log';
import {debounce} from './utils';

export interface Props {}
export interface State {
    compile_result? : IDebugResult
}

export default class App extends React.Component<Props, State> {
    private _compiler : Compiler<string, string>; 
    constructor(props : Props) {
        super(props);
        this._compiler = new Compiler('compiler::sql_to_mongo', new SqlFrontend(), new MongoBackend());
    }
    compile(input : string) {
        let compile_result = this._compiler.debug_transform(input); 
        this.setState({
            compile_result: compile_result 
        });
        if (compile_result.success) {
            console.info(compile_result.output);
        } else {
            console.trace(compile_result.output);
        }
    }
    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={12} md={6}>
                        <Editor onChange={debounce(this.compile, 1000).bind(this)} />
                    </Col>
                    <Col xs={12} md={6}>
                        {this.state ? <CompileLog open={true} result={this.state.compile_result}/> : 'Nothing compiled yet!'}
                    </Col>
                </Row>
            </Grid>
        );
    }
}
