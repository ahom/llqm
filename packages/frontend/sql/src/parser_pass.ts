import {Pass} from 'llqm-core';

import parser, {INode} from './parser';
import {IToken} from './lexer.ts';

export default class ParserPass extends Pass<Array<IToken>, INode> {
    constructor() {
        super('frontend::sql::parser_pass');
    }
    transform(input : Array<IToken>) : INode {
        return <INode>parser.parse([...input]);
    }
}
