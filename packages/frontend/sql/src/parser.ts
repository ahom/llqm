import {ILocation, ILocationRange} from './loc';
import {IToken, KeywordTags as kw, FunctionTags as fn, OperatorTags as op, PunctuationTags as punc, ValueTags as val} from './lexer';

/****************** simple implementation of parser ***************************/
export class SyntaxError extends Error {
    public name: string;
    constructor(
            public rloc: ILocationRange, 
            public expected: Array<string>, 
            public found: string, 
            public message?: string) {
        super(message);
        this.name = 'SyntaxError';
    }
}

export class EndOfInputError extends Error {
    public name: string;
    constructor(
            public expected: Array<string>, 
            public message?: string) {
        super(message);
        this.name = 'EndOfInputError';
    }
}

export interface INode {
    typename: string,
    rloc: ILocationRange,
    value: any
}

export abstract class Rule {
    constructor() {}
    abstract entry_tags(): Array<string>;
    abstract parse(tokens: Array<IToken>): INode;
}

class TagRule extends Rule {
    constructor(protected _tag: string) {
        super();
    }
    entry_tags(): Array<string> {
        return [this._tag];
    }
    parse(tokens: Array<IToken>): INode {
        if (tokens.length === 0) {
            throw new EndOfInputError(this.entry_tags());
        }
        let token = tokens.shift();
        if (token.tag === this._tag) {
            return {
                typename: "tag",
                rloc: token.rloc,
                value: token.value
            };
        }
        throw new SyntaxError(token.rloc, this.entry_tags(), token.value);
    }
}

class ListRule extends Rule {
    constructor(protected _rules: Array<Rule>, protected _action: (node: INode) => INode) {
        super();
        if (this._rules.length === 0) {
            throw new Error('ListRule with empty list');
        }
    }
    entry_tags(): Array<string> {
        return this._rules[0].entry_tags();
    }
    parse(tokens: Array<IToken>): INode {
        let nodes = this._rules.map((rule) => rule.parse(tokens)).filter((node) => node !== null); 
        return this._action({
            typename: "list",
            rloc: {
                start: nodes[0].rloc.start,
                end: nodes[nodes.length - 1].rloc.end
            },
            value: nodes
        });
    }
}

class ChoiceRule extends Rule {
    protected _rule_map: { [tag: string]: Rule };
    constructor(protected _rules: Array<Rule>, protected _action: (node: INode) => INode) {
        super();
        this._rule_map = {};
        for (let rule of this._rules) {
            this.push(rule);
        }
    }
    push(rule: Rule): ChoiceRule { // used for circular references
        for (let tag of rule.entry_tags()) {
            if (this._rule_map[tag] !== undefined) {
                throw new Error('Ambiguous grammar');
            }
            this._rule_map[tag] = rule;
        }
        return this;
    }
    entry_tags(): Array<string> {
        return Object.keys(this._rule_map);
    }
    parse(tokens: Array<IToken>): INode {
        if (tokens.length === 0) {
            throw new EndOfInputError(this.entry_tags());
        }
        let token = tokens[0];
        let matching_rule = this._rule_map[token.tag];
        if (matching_rule !== undefined) {
            return this._action(matching_rule.parse(tokens));
        }
        throw new SyntaxError(token.rloc, this.entry_tags(), token.value);
    }
}

class RepetitionRule extends Rule {
    protected _rule_tags: Array<string>;
    constructor(protected _rule: Rule) {
        super();
        this._rule_tags = this._rule.entry_tags();
    }
    entry_tags(): Array<string> {
        throw new Error('Repetition not allowed at start of rule');
    }
    parse(tokens: Array<IToken>): INode {
        if (tokens.length === 0) {
            return null;
        }
        let rv: INode = {
            typename: "repetition",
            rloc: {
                start: tokens[0].rloc.start,
                end: tokens[0].rloc.start
            },
            value: []
        };
        while (tokens.length > 0 && this._rule_tags.indexOf(tokens[0].tag) !== -1) {
            rv.value.push(this._rule.parse(tokens));
            rv.rloc.end = rv.value[rv.value.length - 1].rloc.end;
        }
        return rv;
    }
}

export class Parser {
    constructor(protected _rule: Rule) {}
    parse(input: Array<IToken>): INode {
        return this._rule.parse(input);
    }
}

/**************************** actual parser ***********************************/
function make_rule(rule: any): Rule {
    if (typeof rule === "string") {
        return new TagRule(rule);
    } else if (rule instanceof Rule) {
        return rule;
    }
    throw Error('Cannot make rule');
}

const noop = (node: INode) => node;
function list(rules: Array<any>, action: (node:INode) => INode = noop): ListRule {
    return new ListRule(rules.map((rule) => make_rule(rule)), action);
}

function choice(rules: Array<any>, action: (node: INode) => INode = noop): ChoiceRule {
    return new ChoiceRule(rules.map((rule) => make_rule(rule)), action);
}

function repeat(rule: any): RepetitionRule {
    return new RepetitionRule(make_rule(rule));
}

let value = choice([
    val.bool,
    val.float,
    val.int,
    val.string
], (node) => {
    return {
        typename: "value",
        rloc: node.rloc,
        value: node.value
    }
});

let ident = choice([val.ident], (node) => {
    return {
        typename: "ident",
        rloc: node.rloc,
        value: node.value
    };
});

let keyword = choice(Object.keys(kw).map((key) => (<any>kw)[key].tag));

let path = list([
    ident,
    repeat(
        choice([
            list(['[', value, ']'], (node) => {
                return {
                    typename: "array_index",
                    rloc: node.rloc,
                    value: node.value[1]
                };
            }),
            list(['.', choice([keyword, ident])], (node) => {
                return {
                    typename: "ident",
                    rloc: node.rloc,
                    value: node.value[1].value
                };
            })
        ])
    )
], (node) => {
    return {
        typename: "path",
        rloc: node.rloc,
        value: [node.value[0]].concat(node.value[1] ? node.value[1].value : [])
    };
});

let base_expr = choice([
    value,
    path
]);

let mult_expr = list([
    base_expr,
    repeat(
        list([
            choice(['*', '/']),
            base_expr
        ])
    )
], (node) => {
    if (!node.value[1]) {
        return node.value[0];
    }
    return node;
});

let add_expr = list([
    mult_expr,
    repeat(
        list([
            choice(['+', '-']),
            mult_expr
        ])
    )
], (node) => {
    if (!node.value[1]) {
        return node.value[0];
    }
    return node;
});

let expr = choice([
    add_expr
]);
base_expr.push(
    list(['(', expr, ')'], (node) => {
        return node.value[1];
    })
);

let query = list([
    kw.select.tag,
    expr
]);

let parser = new Parser(expr);
export default parser;
