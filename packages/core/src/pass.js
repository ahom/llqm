export default class Pass {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
    }

    apply(input) {
        throw Error('Not Implemented');
    }

    debug_apply(input) {
        try {
            let copied_input = JSON.parse(JSON.stringify(input));
            return {
                success: true,
                name: this.name,
                desc: this.desc,
                output: this.apply(copied_input) 
            };
        } catch (err) {
            return {
                success: false,
                name: this.name,
                desc: this.desc,
                output: err
            };
        }
    }
}
