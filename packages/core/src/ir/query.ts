import {Node, NodeVisitor} from './node';
import {Operation} from './operation';

export class Query extends Node {
    constructor(public ops : Array<Operation>) {
        super('query');
    }

    each<T>(visitor: NodeVisitor<T>) {
        this.apply(visitor);
        for (let op of this.ops) {
            op.each(visitor);
        }
    }
}

