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
        this.comp = new Compiler()
            .frontend(new SqlFrontend())
            .backend(new MongoBackend());
    }
    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={12} md={6}><Editor compiler={this.comp}/></Col>
                    <Col xs={12} md={6}><CompileLog compiler={this.comp}/></Col>
                </Row>
            </Grid>
        );
    }
}
/*

*/
