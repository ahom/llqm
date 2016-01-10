import {Pipeline, Pass, ir, utils} from 'llqm-core';

import {INode} from './parser';
import gencode from './gencode';

export default class GencodePass extends Pass<INode, ir.Node> {
    constructor() {
        super('frontend::sql::gencode_pass');
    }
    transform(input : INode) : ir.Node {
        return utils.visit(gencode, input);
    }
}
