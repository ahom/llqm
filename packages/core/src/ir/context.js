export default class Context {
    constructor(loc, type) {
        this.loc = loc;
        this.type = type;
    }

    has_loc() {
        return this.loc !== undefined || this.loc !== null;
    }

    has_type() {
        return this.type !== undefined || this.type !== null;
    }
}
