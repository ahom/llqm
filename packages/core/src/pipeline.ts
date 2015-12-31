import {Pass, IDebugResult} from './pass';

export default class Pipeline<IN, MID, OUT> extends Pass<IN, OUT> {
    constructor(
            name : string,
            protected frontend : Pass<IN, MID>, 
            protected backend : Pass<MID, OUT>, 
            public transforms : Array<Pass<MID, MID>> = []) 
    {
        super(name);
    }

    transform(input : IN) : OUT {
        let ir : MID = this.frontend.transform(input);
        this.transforms.forEach((tr) => ir = tr.transform(ir));
        return this.backend.transform(ir);
    }

    debug_transform(input : IN) : IDebugResult {
        let result : IDebugResult = {
            name: this.name,
            success: false,
            sub_results: [],
            output: null
        };
        let output = input;
        for (let pass of <Array<Pass<IN|MID, MID|OUT>>>[this.frontend, ...this.transforms, this.backend]) {
            let sub_result = pass.debug_transform(output);
            result.sub_results.push(sub_result);
            result.output = sub_result.output;
            result.success = sub_result.success;
            if (!result.success) {
                break;
            }
        }
        return result;
    }

    push_back<T>(pass : Pass<OUT, T>, name? : string) : Pipeline<IN, OUT, T> {
        return new Pipeline<IN, OUT, T>(name || this.name, this, pass);
    }

    push_front<T>(pass : Pass<T, IN>, name? : string) : Pipeline<T, IN, OUT> {
        return new Pipeline<T, IN, OUT>(name || this.name, pass, this);
    }
}
