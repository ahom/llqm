import {Node, def_node} from './node';
import {Operation} from './operation';

@def_node({
    typename: 'query', 
    description: 'List of operations',
    children: ['ops']
})
export class Query extends Node {
    constructor(public ops : Array<Operation>) {
        super();
    }
}

