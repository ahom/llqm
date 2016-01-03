import {Node, def_node} from './node';

export abstract class Operation extends Node {
}

@def_node({
    typename: 'limit_op',
    description: 'Limits the number of results'
})
export class LimitOp extends Operation {
    constructor(public count : number) {
        super();
    }
}
