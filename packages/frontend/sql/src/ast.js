export class Visitor {
    expr_nary() {}
    expr_path() {}
    expr_value() {}
    
    path() {}
    path_comp() {}
    path_slice() {}

    identifier() {}
}

export function visit(visitor, ast) {
    let rv = null;
    if (Array.isArray(ast)) {
        rv = ast.map((item) => visit(visitor, item));
    } else {
        rv = visitor[ast.nodename](ast);
    }
    return rv;
}

export function each(vistor, ast) {
    let rv = {};
    for (let child_name of ast.children) {
        rv[child_name] = visit(visitor, ast[child_name]);
    }
    return rv;
}
