{
    function ast(typename, props, children_props) {
    	props.typename = typename;
        props.loc = location();
        props.children = [];
        for (var prop in children_props) {
            props[prop] = children_props[prop];
            props.children.push(prop);
        }
        return props;
    }
    
    function ast_leaf(typename, value) {
        return ast(typename, { value: value }, {});
    }
}

// TODO: query
query
    = _ expr _

// TODO: expr
expr
    = add_expr
    / base_expr

add_expr
    = lhe:mul_expr tail:(_ op:('+'/'-') _ expr:mul_expr { return { op: op, expr: expr }; })* {
        if (tail.length === 0) {
            return lhe;
        }
        let rv = lhe;
        tail.forEach((item) => {
            if (item.op !== rv.op) {
                rv = ast("expr:nary", { op: item.op }, { exprs: [rv] });
            } 
            rv.exprs.push(item.expr);
        });
        return rv;
    }

mul_expr
    = lhe:base_expr tail:(_ op:('*'/'/') _ expr:base_expr { return { op: op, expr: expr }; })* {
        if (tail.length === 0) {
            return lhe;
        }
        let rv = lhe;
        tail.forEach((item) => {
            if (item.op !== rv.op) {
                rv = ast("expr:nary", { op: item.op }, { exprs: [rv] });
            } 
            rv.exprs.push(item.expr);
        });
        return rv;
    }


base_expr
    = value_expr
    / path_expr
    / '(' _ expr:expr _ ')' {
        return expr;
    }

path_expr
    = path:path {
        return ast("expr:path", {}, { path: path });
    }

value_expr
    = value:value {
        return ast_leaf("expr:value", value);
    }

// path
path
    = head:path_comp tail:('.' comp:path_comp { return comp; })* {
        return ast("path", {}, { comps: [head].concat(tail) });
    }

path_comp
    = ident:identifier path_slices:(path_slice)* {
        return ast("path:comp", { ident: ident }, { slices: path_slices });
    }

path_slice
    = '[' _ lbound:expr size:(_ ':' _ size:expr { return size; }) _ ']' {
        return ast("path:slice", {}, { lbound: lbound, size: size });
    }

identifier
    = [a-zA-Z_]+ {
        return text();
    }

// value
value
    = bool
    / string
    / float
    / integer

// bool
bool
    = ('true'i/'false'i) {
        return text().toLowerCase === 'true';
    }

// string
string
    = quotation_mark chars:char* quotation_mark {
        return chars.join("");
    }

char
    = unescaped
    / escape
      sequence:(
          '"'
          / '\\'
          / '/'
          / 'b' { return '\b'; }
          / 'f' { return '\f'; }
          / 'n' { return '\n'; }
          / 'r' { return '\r'; }
          / 't' { return '\t'; }
          / 'u' digits:$(hexdigit hexdigit hexdigit hexdigit) {
              return String.fromCharCode(parseInt(digits, 16));
          }
      ) {
        return sequence;
    }

escape = '\\'
quotation_mark = '"'
unescaped = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]

hexdigit = [0-9a-f]i    

// number
float
    = ('-'/'+')? [1-9] digit* ('.' digit+)? {
        return parseFloat(text());
    }

integer
    = ('-'/'+')? [1-9] digit* {
        return parseInt(text(), 10);
    }

digit = [0-9]

// whitespace
_
    = ([ \n\t\r]/comment)*
__
    = ([ \n\t\r]/comment)+

// comment
comment
    = single_line_comment
    / multi_line_comment

single_line_comment
    = "--" [^\n\r]* 

multi_line_comment
    = "/*" (!"*/" [^*]+)* "*/"
