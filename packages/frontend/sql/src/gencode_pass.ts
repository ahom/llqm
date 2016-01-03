import {Pipeline, Pass} from 'llqm-core';
import {Node as IRNode} from 'llqm-core/ir';

import {INode as ASTINode} from './ast';

class GencodePass extends Pass<ASTINode, IRNode> {
    constructor() {
        super('frontend::sql::gencode_pass');
    }
    transform(input : ASTINode) : IRNode {
        throw new Error("TODO"); // TODO
    }
}

let pass = new GencodePass();
export default pass;
