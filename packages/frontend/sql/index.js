import { Pipeline } from "llqm-core";

import parser_pass from "./src/parser_pass.js";
import gencode_pass from "./src/gencode_pass.js";

export default class SqlFrontend extends Pipeline {
    constructor() {
        super();
    }

    pipeline() {
        return parser_pass + super.pipeline() + gencode_pass;
    }
}
