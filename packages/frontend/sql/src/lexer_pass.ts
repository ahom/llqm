import {Pass} from 'llqm-core';

import lexer, {IToken} from './lexer';

export class LexerPass extends Pass<string, Array<IToken>> {
    constructor() {
        super('frontend::sql::lexer_pass');
    }
    transform(input : string) : Array<IToken> {
        return lexer.lex(input);
    }
}

let pass = new LexerPass();
export default pass;
