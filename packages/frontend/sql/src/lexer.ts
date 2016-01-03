import {ILocation, ILocationRange} from './loc';

/********************** Very simple Lexer implementation *********************/
export class LexError extends Error {
    public name: string;
    constructor(
            public loc: ILocation, 
            public message?: string) {
        super(message);
        this.name = 'LexError';
    }
}

export interface IRule {
    classname: string,
    tag: string,
    regexp: string,
    value: (match: Array<string>) => string
}

export interface IToken {
    classname: string, 
    tag: string,
    value: string,
    rloc: ILocationRange 
}

export interface IContext {
    input: string,
    size: number,
    loc: ILocation
}

export class Lexer {
    protected _regexps: Array<RegExp>; 
    constructor(public rules : Array<IRule>) {
        this._regexps = rules.map((rule) => new RegExp('^' + rule.regexp, 'i'));
    }
        
    parse_rule_id(ctx: IContext, rule_id: number) : IToken {
        let match = this._regexps[rule_id].exec(ctx.input.substr(ctx.loc.offset));        
        if (match === null) {
            return null;
        } 
        let rule = this.rules[rule_id];
        let value = rule.value(match);

        let matching_string = match[0];
        let matching_lines = matching_string.split('\n');
        let matching_line_count = matching_lines.length - 1;

        let start_loc = ctx.loc;
        ctx.loc = {
            line: start_loc.line + matching_line_count,
            col: (matching_line_count !== 0 ? 0 : start_loc.col) + matching_lines[matching_line_count].length,
            offset: start_loc.offset + matching_string.length
        };

        return {
            classname: rule.classname,
            tag: rule.tag,
            value: rule.value(match),
            rloc: {
                start: start_loc,
                end: ctx.loc
            }
        };
    }

    next(ctx: IContext): IToken {
        let start_loc = ctx.loc;
        for(let rule_id in this.rules) {
            let token = this.parse_rule_id(ctx, rule_id);
            if (token !== null) {
                return token;
            }
        }
        return null;
    }

    lex(input: string): Array<IToken> {
        let ctx = {
            input: input,
            size: input.length,
            loc: {
                line: 0,
                col: 0,
                offset: 0
            }
        };
        
        let tokens: Array<IToken> = [];
        while (ctx.loc.offset < ctx.size) {
            let token = this.next(ctx);
            if (token !== null) {
                tokens.push(token);
            } else {
                throw new LexError(ctx.loc, 'No valid token found');
            }
        }

        return tokens;
    }
}

/***************************** Actual Lexer ***********************************/
function match_discard(match: Array<string>): string {
    return null;
}

function match_all(match: Array<string>): string {
    return match[0];
}

function match_to_upper_case(match: Array<string>): string {
    return match_all(match).toUpperCase();
}

function match_first(match: Array<string>): string {
    return match[1];
}

export const ClassName = {
    blank: 'BLANK',
    comment: 'COMMENT',
    keyword: 'KEYWORD',
    function: 'FUNCTION',
    operator: 'OPERATOR',
    punctuation: 'PUNCTUATION',
    value: 'VALUE'
};

export const RemovableTag = 'REMOVABLE';

export const KeywordTags = {
    and: {regexp: 'AND', tag: 'AND'},
    or: {regexp: 'OR', tag: 'OR'},
    not: {regexp: 'NOT', tag: 'NOT'},
    any: {regexp: 'ANY', tag: 'ANY'},
    all: {regexp: 'ALL', tag: 'ALL'},
    satisfies: {regexp: 'SATISFIES', tag: 'SATISFIES'},
    for: {regexp: 'FOR', tag: 'FOR'},
    in: {regexp: 'IN', tag: 'IN'},
    nin: {regexp: 'NIN', tag: 'NIN'},
    null: {regexp: 'NULL', tag: 'NULL'},
    from: {regexp: 'FROM', tag: 'FROM'},
    select: {regexp: 'SELECT', tag: 'SELECT'},
    unnest: {regexp: 'UNNEST', tag: 'UNNEST'},
    let: {regexp: 'LET', tag: 'LET'},
    where: {regexp: 'WHERE', tag: 'WHERE'},
    groupby: {regexp: 'GROUP\\s+BY', tag: 'GROUP BY'},
    letting: {regexp: 'LETTING', tag: 'LETTING'},
    having: {regexp: 'HAVING', tag: 'HAVING'},
    orderby: {regexp: 'ORDER\\s+BY', tag: 'ORDER BY'},
    limit: {regexp: 'LIMIT', tag: 'LIMIT'}
};
export const FunctionTags = {
    sum: {regexp: 'SUM', tag: 'SUM'},
    avg: {regexp: 'AVG', tag: 'AVG'},
    count: {regexp: 'COUNT', tag: 'COUNT'},
    array_sum: {regexp: 'ARRAY_SUM', tag: 'ARRAY_SUM'},
    array_size: {regexp: 'ARRAY_SIZE', tag: 'ARRAY_SIZE'},
    union: {regexp: 'SET_UNION', tag: 'SET_UNION'},
    intersect: {regexp: 'SET_INTERSECTION', tag: 'SET_INTERSECTION'},
    difference: {regexp: 'SET_DIFFERENCE', tag: 'SET_DIFFERENCE'}
};
export const OperatorTags = {
    div: {regexp: '/', tag: '/'},
    mul: {regexp: '\\*', tag: '*'},
    plus: {regexp: '\\+', tag: '+'},
    min: {regexp: '-', tag: '-'},
    eq: {regexp: '=', tag: '='},
    ne: {regexp: '!=', tag: '!='},
    lte: {regexp: '<=', tag: '<='},
    lt: {regexp: '<', tag: '<'},
    gte: {regexp: '>=', tag: '>='},
    gt: {regexp: '>', tag: '>'}
};
export const PunctuationTags = {
    dot: {regexp: '\\.', tag: '.'},
    comma: {regexp: ',', tag: ','},
    lpar: {regexp: '\\(', tag: '('},
    rpar: {regexp: '\\)', tag: ')'},
    lcbra: {regexp: '\\{', tag: '{'},
    rcbra: {regexp: '\\}', tag: '}'},
    lbra: {regexp: '\\[', tag: '['},
    rbra: {regexp: '\\]', tag: ']'},
    col: {regexp: ':', tag: ':'}
};
export const ValueTags = {
    string: 'string',
    float: 'float',
    int: 'int',
    bool: 'bool',
    ident: 'ident'
};

export const lex_rules: Array<IRule> = [].concat(
    [
        { regexp: '[\\s\\n\\r]+', classname: ClassName.blank, tag: RemovableTag, value: match_discard },
        { regexp: '//.*', classname: ClassName.comment, tag: RemovableTag, value: match_all },
        { regexp: '/\\*[^]*?\\*/', classname: ClassName.comment, tag: RemovableTag, value: match_all }
    ],
    Object.keys(KeywordTags).map((kw) => {
        return {
            classname: ClassName.keyword,
            tag: (<any>KeywordTags)[kw].tag,
            regexp: (<any>KeywordTags)[kw].regexp + '(?=[\\s\\n\\r])',
            value: match_all
        };
    }),
    Object.keys(FunctionTags).map((func) => {
        return {
            classname: ClassName.function,
            tag: (<any>FunctionTags)[func].tag,
            regexp: (<any>FunctionTags)[func].regexp + '(?=\\()', // Function names must be followed by (
            value: match_all
        };
    }),
    Object.keys(OperatorTags).map((op) => {
        return {
            classname: ClassName.operator,
            tag: (<any>OperatorTags)[op].tag,
            regexp: (<any>OperatorTags)[op].regexp,
            value: match_all
        };
    }),
    Object.keys(PunctuationTags).map((punc) => {
        return {
            classname: ClassName.punctuation,
            tag: (<any>PunctuationTags)[punc].tag,
            regexp: (<any>PunctuationTags)[punc].regexp,
            value: match_all
        };
    }),
    [
        { regexp: '\\d+\\.\\d+', classname: ClassName.value, tag: ValueTags.float, value: match_all },
        { regexp: '\\d+', classname: ClassName.value, tag: ValueTags.int, value: match_all },
        { regexp: 'true', classname: ClassName.value, tag: ValueTags.bool, value: match_to_upper_case },
        { regexp: 'false', classname: ClassName.value, tag: ValueTags.bool, value: match_to_upper_case },
        { regexp: '"([^"]*)"', classname: ClassName.value, tag: ValueTags.string, value: match_first },
        { regexp: "'([^']*)'", classname: ClassName.value, tag: ValueTags.string, value: match_first },
        { regexp: '[a-z]\\w*', classname: ClassName.value, tag: ValueTags.ident, value: match_all }
    ]
);

let lexer = new Lexer(lex_rules);
export default lexer;

