export interface Visited {
    typename: string;
}

export type Visitor<T extends Visited, U> = {
    [typename: string]: (node: T) => U;
}

export const defaul_visit = "default";

export function visit<T extends Visited, U>(visitor: Visitor<T, U>, node: T): U {
    let func = visitor[node.typename];
    if (func === undefined) {
        func = visitor[defaul_visit]; 
    }
    return func !== undefined ? func(node) : null;
}
