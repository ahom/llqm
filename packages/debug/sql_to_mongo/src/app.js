import React from 'react';
import { Grid, Row, Col, Alert } from 'react-bootstrap';

import { Compiler } from 'llqm-core';
import SqlFrontend from 'llqm-frontend-sql';
import MongoBackend from 'llqm-backend-mongo';

import Editor from './editor.js';
import CompileLog from './compile_log.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        // setting up the compiler
        this.compiler = new Compiler()
            .frontend(new SqlFrontend())
            .backend(new MongoBackend());

        // compilation timer
        this.timer = null;

        // ref to editor
        this.editor = null;

        // state
        this.state = {
            result: {
                type: 'info',
                message: 'Nothing compiled yet.'
            },
            passes: []
        };
    }
    compileCode() {
        this.timer = null;
        let passes = [];
        let output = this.editor.state.code;
        try {
            for (let pass of this.compiler.pipeline()) {
                let current_pass = {
                    state: 'danger',
                    name: pass.name,
                    desc: pass.desc,
                    output: {}
                };
                passes.push(current_pass);
                output = pass.apply(output);
                current_pass.output = JSON.parse(JSON.stringify(output));
                current_pass.state = 'success';
            }
            this.setState({
                result: {
                    type: 'success',
                    message: 'Compilation succeeded.'
                }
            });
        } catch (err) {
            this.setState({
                result: {
                    type: 'danger',
                    message: (<span><strong>{err.name}: </strong>{err.message}</span>)
                }
            });
        }
        this.setState({
            passes: passes
        });
    }
    onEditorChange() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(this.compileCode.bind(this), 1000);
    }
    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={12} md={6}>
                        <Editor onChange={this.onEditorChange.bind(this)} ref={(ref) => this.editor = ref}/>
                        <br />
                        <Alert bsStyle={this.state.result.type}>{this.state.result.message}</Alert>
                    </Col>
                    <Col xs={12} md={6}><CompileLog passes={this.state.passes}/></Col>
                </Row>
            </Grid>
        );
    }
}
/*

*/
