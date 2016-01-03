import {Pass} from 'llqm-core';

import {INode} from './ast';
import parser from './parser';
import {IToken} from './lexer.ts';

class ParserPass extends Pass<Array<IToken>, INode> {
    constructor() {
        super('frontend::sql::parser_pass');
    }
    transform(input : Array<IToken>) : INode {
        return <INode>parser.parse([...input]);
    }
}

let pass = new ParserPass();
export default pass;
