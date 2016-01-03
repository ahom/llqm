import {Pass} from "llqm-core";
import {Node} from "llqm-core/ir";

class GencodePass extends Pass<Node, any> {
    constructor() {
        super('backend::mongo::gencode_pass');
    }
    transform(input : Node) : any {
        throw new Error("TODO"); // TODO
    }
}

export default GencodePass;
