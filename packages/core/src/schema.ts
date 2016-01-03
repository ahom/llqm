export enum Type {
    integer,
    float,
    string,
    date,
    boolean,
    array,
    object
}

export interface INode {
    type : Type
}

export interface IArrayNode extends INode {
    sub_node : INode
}

export interface IObjectChildInformation {
    description : string,
    node : INode
}

export interface IObjectNode extends INode {
    children : { [name : string] : IObjectChildInformation } 
}

export function is_array(node : INode) {
    return node.type === Type.array;
}

export function is_object(node : INode) {
    return node.type === Type.object;
}

export function get_child_info(name : string, node : INode) : IObjectChildInformation {
    if (!is_object(node)) {
        throw new Error('Node is not an object, cannot search for child [' + name + ']');
    }
    let child_info = (<IObjectNode>node).children[name];
    if (child_info === undefined) {
        throw new Error('Child [' + name + '] is not defined.');
    }
    return child_info;
}
