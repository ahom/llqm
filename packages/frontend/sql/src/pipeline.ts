import {Pipeline, Pass} from 'llqm-core';
import {Node as IRNode} from 'llqm-core/ir';

import {INode as IASTNode} from './ast';
import {IToken} from './lexer';
import lexer_pass from './lexer_pass';
import remove_tokens_pass from './remove_tokens_pass';
import parser_pass from './parser_pass';
import gencode_pass from './gencode_pass';

export class ParserPipeline extends Pipeline<string, Array<IToken>, IASTNode> {
    constructor(transforms: Array<Pass<Array<IToken>, Array<IToken>>> = []) {
        super('frontend::sql::parser_pipeline', lexer_pass, parser_pass, transforms);
    }
}

export default class SqlPipeline extends Pipeline<string, IASTNode, IRNode> {
    constructor(
            parser_pipeline: ParserPipeline = new ParserPipeline([remove_tokens_pass]), 
            transforms : Array<Pass<IASTNode, IASTNode>> = []) {
        super('frontend::sql', parser_pipeline, gencode_pass, transforms);
    }
}
