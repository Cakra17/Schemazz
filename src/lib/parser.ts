const KEYWORDS = new Set([
  "CREATE", "TABLE", "PRIMARY", "KEY", "NOT", "NULL", "AUTO_INCREMENT"
]);

const DATATYPE = new Set([
  "INT", "VARCHAR", "TEXT", "BOOLEAN"
]);

type Token = 
  | ["KEYWORD", string]
  | ["DATATYPE", string]
  | ["IDENTIFIER", string]
  | ["NUMBER", string]
  | ["LPAREN", "("]
  | ["RPAREN", ")"]
  | ["COMMA", ","]
  | ["SEMICOLON", ";"];

export function parseQuery(query: string) {
  let token = tokenize(query);
  console.log(token);
}

export function tokenize(query: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const skipWhitepace = () => {
    while (i < query.length && /\s/.test(query[i]!)) i++;
  };

  while (i < query.length) {
    skipWhitepace();

    if (i >= query.length) {
      break;
    }

    const ch = query[i];

    if (ch === "(") { tokens.push(["LPAREN", ch]); i++; continue; }
    if (ch === ")") { tokens.push(["RPAREN", ch]); i++; continue; }
    if (ch === ",") { tokens.push(["COMMA", ch]); i++; continue; }
    if (ch === ";") { tokens.push(["SEMICOLON", ch]); i++; continue;}

    if (/\d/.test(ch!)) {
      let num = "";
      while (i < query.length && /\d/.test(query[i]!)) {
        num += query[i++];
      }
      tokens.push(["NUMBER", num]);
      continue;
    }

    let word = "";
    while (i < query.length && !/\s|[(),;]/.test(query[i]!)) {
      word += query[i++];
    }

    const upper = word.toUpperCase();

    if (KEYWORDS.has(upper)) {
      tokens.push(["KEYWORD", upper]);
    } else if (DATATYPE.has(upper)) {
      tokens.push(["DATATYPE", upper]);
    } else {
      tokens.push(["IDENTIFIER", word]);
    }
  }

  return tokens;
}