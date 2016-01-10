import {ir, utils} from 'llqm-core';

import {INode} from './parser';

let gencode: utils.Visitor<INode, ir.Node> = {
    ident: (node: INode): ir.Node => {
        return new ir.Identifier(node.value).set_rloc(node.rloc);
    },
    path: (node: INode): ir.Node => {
        return new ir.Path(node.value.map((comp: any) => utils.visit(gencode, <INode>comp))).set_rloc(node.rloc);
    },
    default: (node: INode): ir.Node => {
        throw new Error('Unhandled node: ' + node.typename);
    }
}

export default gencode;
