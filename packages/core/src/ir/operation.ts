import {Node} from './node';

export abstract class Operation extends Node {
}

export class LimitOp extends Operation {
    constructor(public count : number) {
        super('limit_op');
    }
}
