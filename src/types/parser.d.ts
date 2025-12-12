import type { Column } from "@/types/column";

export type Token = 
  | ["KEYWORD", string]
  | ["DATATYPE", string]
  | ["IDENTIFIER", string]
  | ["NUMBER", string]
  | ["LPAREN", "("]
  | ["RPAREN", ")"]
  | ["COMMA", ","]
  | ["SEMICOLON", ";"];

export interface RelationDetail {
  columnName: string;
  tableName: string;
}

export interface Relation {
  from: RelationDetail,
  to: RelationDetail,
}

interface AST {
  tableName: string
  column: Column[]
  relation: Relation[],
};