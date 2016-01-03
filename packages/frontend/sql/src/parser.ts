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

interface INode {
    rloc: ILocationRange,
    value: any
}

abstract class Rule {
    constructor(public name?: string) {}
    abstract entry_tags(): Array<string>;
    abstract parse(tokens: Array<IToken>): INode;
}

class TagRule extends Rule {
    constructor(protected _tag: string) {
        super(null);
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
                rloc: token.rloc,
                value: token.value
            };
        }
        throw new SyntaxError(token.rloc, this.entry_tags(), token.value);
    }
}

class ListRule extends Rule {
    constructor(protected _rules: Array<Rule>, protected _action: (node: INode) => INode, name?: string) {
        super(name);
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
    constructor(protected _rules: Array<Rule>, name?: string) {
        super(name);
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
            return matching_rule.parse(tokens);
        }
        throw new SyntaxError(token.rloc, this.entry_tags(), token.value);
    }
}

class RepetitionRule extends Rule {
    protected _rule_tags: Array<string>;
    constructor(protected _rule: Rule, name?: string) {
        super(name);
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
            rloc: {
                start: tokens[0].rloc.start,
                end: tokens[0].rloc.start
            },
            value: []
        };
        while (tokens.length > 0 && this._rule_tags.indexOf(tokens[0].tag) !== -1) {
            rv.value.push(this._rule.parse(tokens));
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
function nlist(name: string, rules: Array<any>, action: (node:INode) => INode = noop): ListRule {
    return new ListRule(rules.map((rule) => make_rule(rule)), action, name);
}
function list(rules: Array<any>, action: (node:INode) => INode = noop): ListRule {
    return nlist(null, rules, action);
}

function nchoice(name: string, rules: Array<any>): ChoiceRule {
    return new ChoiceRule(rules.map((rule) => make_rule(rule)), name);
}
function choice(rules: Array<any>): ChoiceRule {
    return nchoice(null, rules);
}

function nrepeat(name: string, rule: any): RepetitionRule {
    return new RepetitionRule(make_rule(rule), name);
}
function repeat(rule: any): RepetitionRule {
    return nrepeat(null, rule);
}

let value = nchoice("value", [
    val.bool,
    val.float,
    val.int,
    val.string
]);

let keyword = choice(Object.keys(kw).map((key) => (<any>kw)[key].tag));

let path = nlist("path", [
    val.ident,
    repeat(
        choice([
            list(['[', val.int, ']']),
            list(['.', choice([keyword, val.ident])])
        ])
    )
]);

let base_expr = nchoice("expr", [
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
]);

let add_expr = list([
    mult_expr,
    repeat(
        list([
            choice(['+', '-']),
            mult_expr
        ])
    )
]);

let expr = choice([
    add_expr
]);
base_expr.push(
    list(['(', expr, ')'])
);

let query = nlist("query", [
    kw.select.tag,
    expr
]);

let parser = new Parser(query);
export default parser;
