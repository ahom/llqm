import {Pass} from "llqm-core";
import {INode} from "llqm-core/ir";

class GencodePass extends Pass<INode, any> {
    constructor() {
        super('backend::mongo::gencode_pass');
    }
    transform(input : INode) : any {
        throw new Error("TODO"); // TODO
    }
}

export default GencodePass;
