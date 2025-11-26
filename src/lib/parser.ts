const KEYWORDS = new Set([
  "CREATE", 
  "TABLE", 
  "PRIMARY", 
  "KEY", 
  "NOT", 
  "NULL", 
  "AUTO_INCREMENT", 
  "FOREIGN", 
  "UNIQUE", 
  "DEFAULT", 
  "CURRENT_DATE"
]);

const DATATYPE = new Set([
  "INT", "VARCHAR", "TEXT", "BOOLEAN", "DATE"
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

interface Column {
  name: string;
  dataType: string;
  constraint: string[];
}

interface AST {
  tableName: string
  column: Column[]
};

export class NoobSQLParser {
  private text: string;
  private tokens: Token[];
  private asts: AST[];
  private pos: number;

  constructor() {
    this.text = "";
    this.tokens = [];
    this.asts = [];
    this.pos = 0;
  }

  public SetSQLText(text: string) {
    this.text = text;
    this.lexer(this.text);
    console.log(this.tokens);
  }

  public Parse() {
    this.pos = 0;
    let temp: AST = {
      tableName: "",
      column: []
    };

    while(this.pos < this.tokens.length) {
      this.expectedKeyword("CREATE");
      this.expectedKeyword("TABLE");
      const tableName = this.next();
      if (tableName?.[0] !== "IDENTIFIER") throw new Error("Expected Table Name");
      temp.tableName = tableName[1];
  
      if (this.peek()?.[0] !== "LPAREN") throw new Error("Expected (");
      this.next();
  
      while (this.peek()?.[0] !== "RPAREN") {
        temp.column.push(this.parseColumn());
        if (this.peek()?.[0] === "COMMA") this.next();
        else if(this.peek()?.[0] !== "RPAREN") throw new Error("Expected , or )");
      }
      this.next();
      if (this.peek()?.[0] === "SEMICOLON") this.next();
  
      this.asts.push(temp);
      temp = {  tableName: "", column: [] };
    }
    console.log(this.asts);
  }

  private parseColumn(): Column {
    let columnName: string = "";
    let constraint: string[] = [];
    let dataType: string = "";

    const namePointer = this.peek();
    if (namePointer?.[0] !== "IDENTIFIER") throw new Error("Invalid Column Name");
    columnName = namePointer?.[1];
    this.next();

    const datatypePointer = this.peek();
    if (datatypePointer?.[0] !== "DATATYPE") throw new Error("Invalid Data Type");
    switch (datatypePointer[1]) {
      case "VARCHAR":
        this.pos += 2
        dataType = `${datatypePointer[1]}(${this.peek()?.[1]})`;
        this.pos += 2;
        break;
      case "INT":
        dataType = datatypePointer[1];
        this.next();
        break;
      case "TEXT":
        dataType = datatypePointer[1];
        this.next();
        break;
      case "BOOLEAN":
        dataType = datatypePointer[1];
        this.next();
        break;
      case "DATE":
        dataType = datatypePointer[1];
        this.next();
        break;
    }

    let pos = 0;
    while(this.peek()?.[0] !== "COMMA") {
      const p = this.peek();
      if (p?.[0] !== "KEYWORD") {
        throw new Error("Invalid Constraint");
      }
      switch (p[1]) {
        case "PRIMARY":
          if (constraint[pos] !== "KEY" && constraint[pos] !== "NOT") {
            constraint[pos++] = p[1];
          }
          break;
        case "KEY":
          if (constraint[pos] !== "NOT") {
            constraint[pos++] = p[1];
          }
          break;
        case "NOT":
          if (constraint[pos] !== "NULL") {
            constraint[pos++] = p[1];
          }
          break;
        case "NULL": 
          if (constraint[pos] !== "PRIMARY") {
            constraint[pos++] = p[1];
          }
          break;
        case "AUTO_INCREMENT":
          if (constraint[pos] !== "PRIMARY" && constraint[pos] !== "NOT" ) {
            constraint[pos++] = p[1];
          }
          break;
        case "UNIQUE":
          constraint[pos++] = p[1];
          break;
      }
      this.next();
    };
    return {
      name: columnName,
      dataType: dataType,
      constraint: constraint,
    }
  }

  private peek() {
    if (this.tokens.length < 1) {
      throw new Error("Token empty, can't peek");
    }
    return this.tokens[this.pos];
  }

  private next() {
    if (this.tokens.length < 1) {
      throw new Error("Token empty, can't next");
    }
    return this.tokens[this.pos++];
  }
  
  private expectedKeyword(key: string) {
    if (
      this.peek()?.[0] === "KEYWORD" && 
      this.peek()?.[1] !== key
    ) {
      throw new Error(`Expected keyword ${key}`);
    }
    return this.next();
  }


  private lexer(query: string) {
    let tokens: Token[] = [];
    let i = 0;

    const skipCommentAndWhiteSpaces = () => {
      let skipped = true;
      while (skipped && i < query.length) {
        skipped = false;
        // whitespace
        if (/\s/.test(query[i]!)) {
          i++;
          skipped = true;
          continue;
        }

        // singgle line comment
        if (query[i] === '-' && query[i+1] === '-') {
          i += 2;
          while(i < query.length && query[i] !== "\n") i++;
          if (i < query.length) i++;
          skipped = true;
          continue;
        }

        // multiline comment
        if (query[i] === '/' && query[i+1] === '*') {
          i += 2;
          while (i + 1 < query.length && (query[i] !== '*' && query[i+1] !== '/')) i++;
          if (i + 1 < query.length) i += 2;
          skipped = true;
          continue;
        }
      }
    }

    while(i < query.length) {
      skipCommentAndWhiteSpaces();

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

    this.tokens = tokens;
  }
}