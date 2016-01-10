import {Node, NodeVisitor} from './node';
import {Value} from './value';
import {Path} from './path';

export abstract class Expr extends Node {
}

export class ValueExpr extends Expr {
    constructor(public value: Value) {
        super('value_expr');
    }

    each<T>(visitor: NodeVisitor<T>) {
        this.apply(visitor);
        this.value.each(visitor);
    }
}

export class PathExpr extends Expr {
    constructor(public path: Path) {
        super('path_expr');
    }

    each<T>(visitor: NodeVisitor<T>) {
        this.apply(visitor);
        this.path.each(visitor);
    }
}
