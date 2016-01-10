import {Node, NodeVisitor} from './node';
import {IntegerValue} from './value.ts';

export class Path extends Node {
    constructor(public comps: Array<PathComp> = []) {
        super('path');
    }

    each<T>(visitor: NodeVisitor<T>) {
        this.apply(visitor);
        for (let comp of this.comps) {
            comp.each(visitor);
        }
    }
}

export abstract class PathComp extends Node {
}

export class Identifier extends PathComp {
    constructor(public name: string) {
        super('ident');
    }
}

export class ArrayIndex extends PathComp {
    constructor(public index: IntegerValue) {
        super('array_index');
    }

    each<T>(visitor: NodeVisitor<T>) {
        this.apply(visitor);
        this.index.each(visitor);
    }
}
