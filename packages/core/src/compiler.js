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
        return this.fe.pipeline().concat(super.pipeline(), this.be.pipeline());
    }

    compile(input) {
        let output = input;
        for (let pass of this.pipeline()) {
            output = pass.apply(output);
        }
        return output;
    }

    debug_compile(input) {
        let output = [];
        for (let pass of this.pipeline()) {
            let result = pass.debug_apply(input);
            output.push(result);
            if (!result.success) {
                break;
            }
            input = result.output;
        }
        return output;
    }
}
