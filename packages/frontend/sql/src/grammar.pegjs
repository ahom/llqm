{
    function ast(nodename, props, children_props) {
        props.nodename = nodename;
        props.loc = location();
        props.children = [];
        for (var prop in children_props) {
            props[prop] = children_props[prop];
            props.children.push(prop);
        }
        return props;
    }
    
    function ast_leaf(nodename, value) {
        return ast(nodename, { value: value }, {});
    }
}

// TEST: start
start = expr

// query
query
    = _ query:(select_from_clause/from_select_clause) _ {
        return ast("query", {}, query);
    }

select_from_clause
    = select:select_clause
    __ from:from_clause {
        return {
            select: select,
            from: from
        };
    }

from_select_clause
    = from:from_clause
    __ select:select_clause {
        return {
            select: select,
            from: from
        };
    }

// select
select_clause
    = "SELECT"i __ select:(select_object/expr) {
        return select;
    }

select_object
    = "{" _ head:select_member tail:(_ "," _ select_member)* _ "}" {
        return ast("select_object", {}, { members: [head].concat(tail) });
    }

select_value
    = select_object
    / expr

select_member
    = name:identifier _ ":" _ value:select_value {
        return ast("select_member", {}, { name:name, value:value });
    }

// from
from_clause
    = "FROM"i __ value:(identifier/query) {
        return value;
    }

// expr
expr
    = add_expr
    / base_expr

add_expr
    = head:mul_expr tail:(_ op:('+'/'-') _ expr:mul_expr { return { op: op, expr: expr }; })* {
        if (tail.length === 0) {
            return head;
        }
        let rv = head;
        tail.forEach((item) => {
            if (item.op !== rv.op) {
                rv = ast("expr_nary", { op: item.op }, { exprs: [rv] });
            } 
            rv.exprs.push(item.expr);
        });
        return rv;
    }

mul_expr
    = head:base_expr tail:(_ op:('*'/'/') _ expr:base_expr { return { op: op, expr: expr }; })* {
        if (tail.length === 0) {
            return head;
        }
        let rv = head;
        tail.forEach((item) => {
            if (item.op !== rv.op) {
                rv = ast("expr_nary", { op: item.op }, { exprs: [rv] });
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
        return ast("expr_path", {}, { path: path });
    }

value_expr
    = value:value {
        return ast_leaf("expr_value", value);
    }

// path
path
    = head:path_comp tail:('.' comp:path_comp { return comp; })* {
        return ast("path", {}, { comps: [head].concat(tail) });
    }

path_comp
    = ident:identifier path_slices:(path_slice)* {
        return ast("path_comp", { ident: ident }, { slices: path_slices });
    }

path_slice
    = '[' _ lbound:expr size:(_ ':' _ size:expr { return size; }) _ ']' {
        return ast("path_slice", {}, { lbound: lbound, size: size });
    }

identifier
    = [a-zA-Z_]+ {
        return ast_leaf("identifier", text());
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
        return text().toLowerCase() === 'true';
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
    = ('-'/'+')? digit+ ('.' digit+)? {
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
