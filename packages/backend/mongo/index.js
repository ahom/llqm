import { Pipeline } from "llqm-core";

import gencode_pass from "./src/gencode_pass.js";

export default class MongoBackend extends Pipeline {
    constructor() {
        super();
    }

    pipeline() {
        return super.pipeline() + gencode_pass;
    }
}
