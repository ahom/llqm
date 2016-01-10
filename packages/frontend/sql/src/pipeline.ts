import {Pipeline, Pass, ir} from 'llqm-core';

import {INode} from './parser';
import {IToken} from './lexer';
import LexerPass from './lexer_pass';
import RemoveTokensPass from './remove_tokens_pass';
import ParserPass from './parser_pass';
import GencodePass from './gencode_pass';

export class ParserPipeline extends Pipeline<string, Array<IToken>, INode> {
    constructor(transforms: Array<Pass<Array<IToken>, Array<IToken>>> = []) {
        super('frontend::sql::parser_pipeline', new LexerPass(), new ParserPass(), transforms);
    }
}

export default class SqlPipeline extends Pipeline<string, INode, ir.Node> {
    constructor(
            parser_pipeline: ParserPipeline = new ParserPipeline([new RemoveTokensPass()]), 
            transforms : Array<Pass<INode, INode>> = []) {
        super('frontend::sql', parser_pipeline, new GencodePass(), transforms);
    }
}
