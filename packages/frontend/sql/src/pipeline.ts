import {Pipeline, Pass} from 'llqm-core';
import {INode as IIRNode} from 'llqm-core/ir';

import {INode as IASTNode} from './ast';
import parser_pass from './parser_pass';
import gencode_pass from './gencode_pass';

export default class SqlPipeline extends Pipeline<string, IASTNode, IIRNode> {
    constructor(transforms : Array<Pass<IASTNode, IASTNode>> = []) {
        super('frontend::sql', parser_pass, gencode_pass, transforms);
    }
}
