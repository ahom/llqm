export interface IDebugResult {
    name : string,
    success : boolean,
    sub_results : Array<IDebugResult>,
    output : any
}

export abstract class Pass<IN, OUT> {
    constructor(public name : string) {}
    abstract transform(input : IN) : OUT;
    debug_transform(input : IN) : IDebugResult {
        let result : IDebugResult = {
            name: this.name,
            success: false,
            sub_results: [],
            output: null
        };
        try {
            result.output = this.transform(input);
            result.success = true;
        } catch (err) {
            result.output = err;
            result.success = false;
        }
        return result;
    }
}
