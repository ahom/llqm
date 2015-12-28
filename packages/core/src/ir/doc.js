import Node from './node.js';

class Identifier extends Node {
    constructor(name) {
        super("identifier");
        this.name = name;
   }
}

class ArrayIndex extends Node {
    constructor(expr) {
        super("array_index");
        this.expr = expr;
    }
}

class ArraySlice extends Node {
    constructor(index, size) {
        super("array_slice");
        this.index = index;
        this.size = size;
    }
}

class Path extends Node {
    constructor(comps = []) {
        super("path");
        this.comps = comps;
    }
}

