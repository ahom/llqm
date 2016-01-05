import {Pass, ir} from "llqm-core";

class GencodePass extends Pass<ir.Node, any> {
    constructor() {
        super('backend::mongo::gencode_pass');
    }
    transform(input : ir.Node) : any {
        throw new Error("TODO"); // TODO
    }
}

export default GencodePass;
