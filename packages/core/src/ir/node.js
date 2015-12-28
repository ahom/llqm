import Context from './context.js';

export default class Node {
    constructor(typename) {
        this.typename = typename;
        this.ctx = new Context();
    }
}

export class Visitor {
    nary_expr() {}
    path_expr() {}
    value_expr() {}

    identifier() {}
    array_slice() {}
    array_index() {}
    path() {}
}

export function visit(visitor, node) {
    visitor[node.typename](node);
}
