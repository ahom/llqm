import Pipeline from './pipeline.js';

export default class Compiler extends Pipeline {
    constructor() {
        super();
        // defaults to noop pipelines
        this.fe = new Pipeline();
        this.be = new Pipeline();
    }

    frontend(fe) {
        this.fe = fe;
        return this;
    }

    backend(be) {
        this.be = be;
        return this;
    }

    pipeline() {
        return this.fe.pipeline() + super.pipeline() + this.be.pipeline();
    }

    compile(input) {
        let output = input;
        this.pipeline().forEach((pass) => output = pass.apply(output));
        return output;
    }
}
