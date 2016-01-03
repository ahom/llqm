import {default as lexer, Lexer, LexError, IRule, ClassName, IContext} from '../src/lexer';

function make_ctx(input: string, offset: number = 0, col: number = 0, line: number = 0) : IContext {
    return {
        input: input,
        size: input.length,
        loc: {
            line: line,
            col: col,
            offset: offset
        }
    };
}

function make_rule(regexp: string, tag: string = "TEST"): IRule {
    return {
        classname: ClassName.keyword,
        tag: tag,
        regexp: regexp,
        value: (match: Array<string>) => match[0].toLowerCase()
    };
}

describe('lexer', () => {
    it('should parse rules correctly', () => {
        let ctx = make_ctx("TesTOnly");
        let rule = make_rule("TEST");
        let token = new Lexer([rule]).next(ctx);
        
        expect(token).not.toBe(null);
        expect(token.classname).toBe(rule.classname);
        expect(token.tag).toBe(rule.tag);
        expect(token.value).toBe(rule.value(['TesT']));

        expect(token.rloc.start).toEqual({
            line: 0,
            col: 0,
            offset: 0
        });
        expect(token.rloc.end).toEqual({
            line: 0,
            col: 4,
            offset: 4
        });

        expect(token.rloc.end).toBe(ctx.loc);
    });
    it('should parse rules correctly at any point in the input', () => {
        expect(new Lexer([make_rule("TEST")]).next(make_ctx("OnlyTesT", 4, 4))).not.toBe(null);
    });
    it('should return null for non matching rule', () => {
        expect(new Lexer([make_rule("TEST")]).next(make_ctx("OnlyTesT"))).toBe(null);
    });
    it('should throw a LexError in case no rule can be found', () => {
        expect(() => new Lexer([make_rule("TEST")]).lex("not test")).toThrow();
    });
    it('should match the first rule that matches', () => {
        let tokens = new Lexer([
            make_rule("lolz"),
            make_rule("TEST", "TAG")
        ]).lex("TEST");

        expect(tokens.length).toBe(1);
        expect(tokens[0].tag).toBe("TAG");
    });
    it('should match several rules until the end', () => {
        expect(new Lexer([
            make_rule("TEST", "TEST"),
            make_rule(" ", "SPACE")
        ]).lex("TEST  TESTTEST TEST").map((token) => token.tag)).toEqual([
            "TEST",
            "SPACE",
            "SPACE",
            "TEST",
            "TEST",
            "SPACE",
            "TEST"
        ]);
    });
});
