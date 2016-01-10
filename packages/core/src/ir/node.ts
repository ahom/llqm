export const default_visit_func = "default";

export interface NodeVisitor<T> {
    [typename : string] : (node : Node) => T
}

export abstract class Node {
    public rloc: any;
    constructor(public typename: string) {}

    set_rloc(val: any): Node {
        this.rloc = val;
        return this;
    }

    apply<T>(visitor : NodeVisitor<T>) : T {
        let func = visitor[this.typename];
        if (func === undefined) {
            func = visitor[default_visit_func];
        }
        return func !== undefined ? func(this) : undefined; // default behavior is to ignore unknown nodes
    }

    each<T>(visitor : NodeVisitor<T>) {
        this.apply(visitor);
    }
}

