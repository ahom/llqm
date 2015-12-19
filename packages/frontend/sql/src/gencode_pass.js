import { Pass } from "llqm-core";

class GencodePass extends Pass {
    constructor() {
        super("frontend::sql::gencode", "AST to IR");
    }

    // TODO: apply
}

let pass = new GencodePass();
export default pass;
