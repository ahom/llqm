import React from 'react';
import ReactDOM from 'react-dom';

import { Compiler } from 'llqm-core';
import SqlFrontend from 'llqm-frontend-sql';
import MongoBackend from 'llqm-backend-mongo';

import Editor from './src/editor.jsx';

function setup() {
    // render app
    ReactDOM.render(<Editor />, document.getElementById("app"));

    // setting up the compiler
    let comp = new Compiler();
    let fe = new SqlFrontend();
    let be = new MongoBackend();
    comp.frontend(fe).backend(be);
}

setup();
