import {Pass} from 'llqm-core';

import {IToken, RemovableTag} from './lexer';

export class RemoveTokensPass extends Pass<Array<IToken>, Array<IToken>> {
    constructor() {
        super('frontend::sql::remove_tokens_pass');
    }
    transform(input : Array<IToken>) : Array<IToken> {
        return input.filter((token) => token.tag !== RemovableTag);
    }
}

let pass = new RemoveTokensPass();
export default pass;
