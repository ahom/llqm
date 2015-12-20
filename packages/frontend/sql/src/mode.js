let mode = {
    // string variable/-2/-3 keyword atom comment operator number
    start: [
        // The regex matches the token, the token property contains the type
        { regex: /FROM|UNNEST|LET|WHERE|GROUP|BY|LETTING|HAVING|SELECT|ORDER|LIMIT|FOR|IN|ANY|ALL|AS|SATISFIES|AND|OR|NOT/i, token: "keyword" },
        { regex: /true|false/i, token: "atom" },
        { regex: /[a-zA-Z][0-9a-zA-Z_-]*(?:\.[a-zA-Z][0-9a-zA-Z_-]*)*/, token: "variable" },
        { regex: /\d+\.?\d*/, token: "number" },
        { regex: /[+-<>=!]+/, token: "operator" },
        { regex: /"[^"]*"/, token: "string" },
        { regex: /\/\/.*/, token: "comment" },
        // indent and dedent properties guide autoindentation
        { regex: /\{/, indent: true },
        { regex: /\}/, dedent: true }
    ],
    // The multi-line comment state.
    comment: [
        { regex: /.*?\*\//, token: "comment", next: "start" },
        { regex: /.*/, token: "comment" }
    ],
    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
        dontIndentStates: ["comment"],
        lineComment: "--"
    }
};

export default mode;
