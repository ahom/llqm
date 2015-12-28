import { Pass, ir } from "llqm-core";

import { Visitor, visit } from './ast.js';

class GencodePass extends Pass {
    constructor() {
        super("frontend::sql::gencode", "AST to IR");
    }

    apply(input) {
        let visitor = new AstVisitor();
        return visit(visitor, input);
    }
}

let pass = new GencodePass();
export default pass;

class AstVisitor extends Visitor {
    expr_nary(node) {
    }
    expr_path(node) {
        return make_path_expr(this.path(node.path),  node.loc);
    }
    expr_value(node) {
        return make_value_expr(node.value, node.loc);
    }
    
    path(node) {
        return make_path(
    }
    path_comp(node) {
    }
    path_slice(node) {
    }

    identifier(node) {
    }
}

