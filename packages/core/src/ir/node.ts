export const default_visit_func = "default";

export interface NodeVisitor<T> {
    [typename : string] : (node : Node) => T
}

export abstract class Node {
    public typename : string;
    public description : string;
    protected _children : Array<string>;

    apply<T>(visitor : NodeVisitor<T>) : T {
        let func = visitor[this.typename];
        if (func === undefined) {
            func = visitor[default_visit_func];
        }
        return func !== undefined ? func(this) : undefined; // default behavior is to ignore unknown nodes
    }

    each<T>(visitor : NodeVisitor<T>) {
        this.apply(visitor);
        for (let child_name of this._children) {
            let child = (<any>this)[child_name];
            if (child !== undefined) {
               each_unroll_array(visitor, child); 
            }
        }
    }
}

export function def_node({ typename, description, children } : {
    typename : string,
    description? : string,
    children? : Array<string>
}) {
    return function (target : Function) : any {
        let registered = function (...args : Array<any>) {
            target.apply(this, args);
            this._typename = typename;
            this._description = description;
            this._children = children;
        };
        return registered;
    }
}

function each_unroll_array<T>(visitor : NodeVisitor<T>, node : any) {
    if (Array.isArray(node)) {
        for (let child of <Array<any>>node) {
            each_unroll_array(visitor, child);
        }
    } else if (node instanceof Node) {
        node.each(visitor);
    } else {
        throw new Error('Cannot visit child that is not an Array nor a Node');
    }
}

