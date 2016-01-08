import {Pipeline, Pass, ir} from 'llqm-core';

import {INode as ASTINode} from './ast';

export class GencodePass extends Pass<ASTINode, ir.Node> {
    constructor() {
        super('frontend::sql::gencode_pass');
    }
    transform(input : ASTINode) : ir.Node {
        throw new Error("TODO"); // TODO
    }
}

let pass = new GencodePass();
export default pass;
