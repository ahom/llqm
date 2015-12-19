export default class Pipeline {
    constructor() {
        this.passes = [];
    }

    pass(pass) {
        this.passes.push(pass);
        return this;
    }

    pipeline() {
        return this.passes;
    }
}
