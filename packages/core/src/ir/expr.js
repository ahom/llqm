import Node from './node.js';
import make_value from  './value.js';

class Expr extends Node {
    constructor(typename) {
        super(typename);
    }
}

export function make_expr(expr) {
    if (expr instanceof Expr) {
        return expr;
    }
    // TOOO: throw Error
}

class ValueExpr extends Expr {
    constructor(value) {
        super("value_expr");
        this.value = value;
    }
}

export function make_value_expr(value) {
    return new ValueExpr(make_value(value));
}

class PathExpr extends Expr {
    constructor(path) {
        super("path_expr");
        this.path = path;
    }
}

export function make_path_expr(path) {
    return new PathExpr(path);
}

class NaryExpr extends Expr {
    constructor(op, exprs) {
        super("nary_expr");
        this.op = op;
        this.exprs = exprs;
    }
}

export function make_nary_expr(op, exprs = []) {
    return new NaryExpr(op, exprs.map((expr) => make_expr(expr)));
}
