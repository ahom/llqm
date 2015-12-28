import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

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
            passes: []
        };
    }
    compileCode() {
        this.timer = null;
        let passes = this.compiler.debug_compile(this.editor.state.code);
        this.setState({
            passes: passes
        });
        console.log('Compilation results:');
        for (let pass of passes) {
            console.log(pass);
        }
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
                    </Col>
                    <Col xs={12} md={6}>
                        <CompileLog passes={this.state.passes}/>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
/*

*/
