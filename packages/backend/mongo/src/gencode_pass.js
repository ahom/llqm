import { Pass } from "llqm-core";

class GencodePass extends Pass {
    constructor() {
        super("backend::mongo::gencode", "IR to mongo");
    }

    // TODO: apply
}

let pass = new GencodePass();
export default pass;
