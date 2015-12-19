export default class Pass {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
    }

    apply(input) {
        throw Error('Not Implemented');
    }
}
