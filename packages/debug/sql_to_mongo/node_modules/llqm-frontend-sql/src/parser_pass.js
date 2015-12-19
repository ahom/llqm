import { Pass } from "llqm-core";

import Grammar from "./grammar.js";

class ParserPass extends Pass {
    constructor() {
        super("frontend::sql::parser", "SQL to AST");
    }

    apply(input) {
        return Grammar.parse(input);
    }
}

let pass = new ParserPass();
export default pass;
