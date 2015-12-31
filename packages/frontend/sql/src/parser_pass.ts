import {Pass} from 'llqm-core';

import {INode} from './ast';
import {parse} from './grammar';

class ParserPass extends Pass<string, INode> {
    constructor() {
        super('frontend::sql::parser_pass');
    }
    transform(input : string) : INode {
        return parse(input);
    }
}

let pass = new ParserPass();
export default pass;
