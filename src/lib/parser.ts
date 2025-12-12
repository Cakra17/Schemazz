import type { Column } from "@/types/column";
import type { AST, Relation, Token} from "@/types/parser"

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
  "CURRENT_DATE",
  "REFERENCES",
]);

const DATATYPE = new Set([
  "INT", "VARCHAR", "TEXT", "BOOLEAN", "DATE"
]);

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
  }

  public GetAST(): AST[] {
    return this.asts;
  }

  public Parse() {
    this.pos = 0;
    let temp: AST = {
      tableName: "",
      column: [],
      relation: [],
    };

    let count = 1;
    while(this.pos < this.tokens.length) {
      this.expectedKeyword("CREATE");
      this.expectedKeyword("TABLE");
      const tableName = this.next();
      if (tableName?.[0] !== "IDENTIFIER") throw new Error("Expected Table Name");
      temp.tableName = tableName[1];
  
      if (this.peek()?.[0] !== "LPAREN") throw new Error("Expected (");
      this.next();
  
      while (this.peek()?.[0] !== "RPAREN") {
        if (this.peek()?.[1] === "FOREIGN") temp.relation.push(this.parseRelation(temp.tableName));
        else temp.column.push(this.parseColumn(temp.tableName, count)); count++;
        if (this.peek()?.[0] === "COMMA") this.next();
        else if(this.peek()?.[0] !== "RPAREN") throw new Error("Expected , or )");
      }
      this.next();
      if (this.peek()?.[0] === "SEMICOLON") this.next();
  
      this.asts.push(temp);
      temp = {  tableName: "", column: [], relation: [] };
      count = 1;
    }
  }

  private parseColumn(tbName: string, num: number): Column {
    let col: Column = {
      id: `${tbName}-${num}`,
      name: "",
      nullable: false,
      type: "",
      unique: false,
      isFK: false,
      isPK: false
    }
    let skipped = false;

    const namePointer = this.peek();
    if (namePointer?.[0] !== "IDENTIFIER") throw new Error("Invalid Column Name");
    col.name = namePointer?.[1];
    this.next();

    const datatypePointer = this.peek();
    if (datatypePointer?.[0] !== "DATATYPE") throw new Error("Invalid Data Type");
    switch (datatypePointer[1]) {
      case "VARCHAR":
        this.pos += 2
        col.type = `${datatypePointer[1]}(${this.peek()?.[1]})`;
        this.pos += 2;
        break;
      case "INT":
        col.type = datatypePointer[1];
        this.next();
        break;
      case "TEXT":
        col.type = datatypePointer[1];
        this.next();
        break;
      case "BOOLEAN":
        col.type = datatypePointer[1];
        this.next();
        break;
      case "DATE":
        col.type = datatypePointer[1];
        this.next();
        break;
    }

    while(!skipped && this.peek()?.[0] !== "COMMA" && this.peek()?.[0] !== "RPAREN") {
      const p = this.peek();
      if (p?.[0] !== "KEYWORD") {
        throw new Error("Invalid Constraint");
      }
      
      if (p[1] === "PRIMARY" && this.tokens[this.pos+1]?.[1] === "KEY") {
        col.isPK = true;
        this.next();
      } else if (p[1] === "NOT" && this.tokens[this.pos+1]?.[1] === "NULL") {
        col.nullable = false;
        this.next();
      } else if (p[1] === "NULL" && this.tokens[this.pos-1]?.[1] !== "NOT") {
        col.nullable = true;
      } else if (p[1] === "UNIQUE") {
        col.unique = true;
      }
      this.next();
    };
    return col;
  }

  private parseRelation(tableName: string): Relation {
    let temp: Relation = {
      from: {
        columnName: "",
        tableName: tableName
      },
      to: {
        columnName: "",
        tableName: ""
      }
    }

    this.expectedKeyword("FOREIGN");
    this.expectedKeyword("KEY");

    if (this.peek()?.[0] !== "LPAREN") throw new Error("Expected (");
    this.next();

    if (this.peek()?.[0] !== "IDENTIFIER") throw new Error("Expected column name in FK");
    temp.from.columnName = this.peek()?.[1]!;
    this.next();

    if (this.peek()?.[0] !== "RPAREN") throw new Error("Expected )");
    this.next();

    this.expectedKeyword("REFERENCES");

    if (this.peek()?.[0] !== "IDENTIFIER") throw new Error("Expected target table name");
    temp.to.tableName = this.peek()?.[1]!;
    this.next();

    if (this.peek()?.[0] !== "LPAREN") throw new Error("Expected (");
    this.next();

    if (this.peek()?.[0] !== "IDENTIFIER") throw new Error("Expected referenced table");
    temp.to.columnName = this.peek()?.[1]!;
    this.next();

    if (this.peek()?.[0] !== "RPAREN") throw new Error("Expected )");
    this.next();

    return temp;
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
        tokens.push(["IDENTIFIER", word.toLowerCase()]);
      }
    }

    this.tokens = tokens;
  }
}