import {Pipeline, Pass} from 'llqm-core';
import {INode as IRINode} from 'llqm-core/ir';

import {INode as ASTINode} from './ast';

class GencodePass extends Pass<ASTINode, IRINode> {
    constructor() {
        super('frontend::sql::gencode_pass');
    }
    transform(input : ASTINode) : IRINode {
        throw new Error("TODO"); // TODO
    }
}

let pass = new GencodePass();
export default pass;
