import { NoobSQLParser } from '@/lib/parser';
import { describe, test, expect } from 'bun:test';


function getTokens(parser: NoobSQLParser): any[] {
  return (parser as any).tokens;
}

function getASTs(parser: NoobSQLParser): any[] {
  return (parser as any).asts;
}

describe('NoobSQLParser - Lexer', () => {
  describe('Keywords', () => {
    test('should tokenize basic keywords', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE');
      const tokens = getTokens(parser);
      
      expect(tokens.length).toBe(2);
      expect(tokens[0]).toEqual(['KEYWORD', 'CREATE']);
      expect(tokens[1]).toEqual(['KEYWORD', 'TABLE']);
    });

    test('should handle case insensitivity', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('create table Create TABLE');
      const tokens = getTokens(parser);
      
      expect(tokens[0]).toEqual(['KEYWORD', 'CREATE']);
      expect(tokens[1]).toEqual(['KEYWORD', 'TABLE']);
      expect(tokens[2]).toEqual(['KEYWORD', 'CREATE']);
      expect(tokens[3]).toEqual(['KEYWORD', 'TABLE']);
    });

    test('should tokenize constraint keywords', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('PRIMARY KEY NOT NULL AUTO_INCREMENT');
      const tokens = getTokens(parser);
      
      expect(tokens.length).toBe(5);
      expect(tokens[0]).toEqual(['KEYWORD', 'PRIMARY']);
      expect(tokens[1]).toEqual(['KEYWORD', 'KEY']);
      expect(tokens[2]).toEqual(['KEYWORD', 'NOT']);
      expect(tokens[3]).toEqual(['KEYWORD', 'NULL']);
      expect(tokens[4]).toEqual(['KEYWORD', 'AUTO_INCREMENT']);
    });
  });

  describe('Data Types', () => {
    test('should tokenize all data types', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('INT VARCHAR TEXT BOOLEAN DATE');
      const tokens = getTokens(parser);
      
      expect(tokens.length).toBe(5);
      expect(tokens[0]).toEqual(['DATATYPE', 'INT']);
      expect(tokens[1]).toEqual(['DATATYPE', 'VARCHAR']);
      expect(tokens[2]).toEqual(['DATATYPE', 'TEXT']);
      expect(tokens[3]).toEqual(['DATATYPE', 'BOOLEAN']);
      expect(tokens[4]).toEqual(['DATATYPE', 'DATE']);
    });
  });

  describe('Identifiers', () => {
    test('should tokenize table and column names', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('users user_id username');
      const tokens = getTokens(parser);
      
      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual(['IDENTIFIER', 'users']);
      expect(tokens[1]).toEqual(['IDENTIFIER', 'user_id']);
      expect(tokens[2]).toEqual(['IDENTIFIER', 'username']);
    });
  });

  describe('Numbers', () => {
    test('should tokenize numeric literals', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('255 100 50');
      const tokens = getTokens(parser);
      
      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual(['NUMBER', '255']);
      expect(tokens[1]).toEqual(['NUMBER', '100']);
      expect(tokens[2]).toEqual(['NUMBER', '50']);
    });
  });

  describe('Special Characters', () => {
    test('should tokenize parentheses, commas, and semicolons', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('( ) , ;');
      const tokens = getTokens(parser);
      
      expect(tokens.length).toBe(4);
      expect(tokens[0]).toEqual(['LPAREN', '(']);
      expect(tokens[1]).toEqual(['RPAREN', ')']);
      expect(tokens[2]).toEqual(['COMMA', ',']);
      expect(tokens[3]).toEqual(['SEMICOLON', ';']);
    });
  });

  describe('Complete Statements', () => {
    test('should tokenize a complete CREATE TABLE statement', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50));');
      const tokens = getTokens(parser);
      
      expect(tokens.length).toBe(16);
      expect(tokens[0]).toEqual(['KEYWORD', 'CREATE']);
      expect(tokens[1]).toEqual(['KEYWORD', 'TABLE']);
      expect(tokens[2]).toEqual(['IDENTIFIER', 'users']);
      expect(tokens[3]).toEqual(['LPAREN', '(']);
      expect(tokens[4]).toEqual(['IDENTIFIER', 'id']);
      expect(tokens[5]).toEqual(['DATATYPE', 'INT']);
      expect(tokens[6]).toEqual(['KEYWORD', 'PRIMARY']);
      expect(tokens[7]).toEqual(['KEYWORD', 'KEY']);
      expect(tokens[8]).toEqual(['COMMA', ',']);
      expect(tokens[9]).toEqual(['IDENTIFIER', 'name']);
      expect(tokens[10]).toEqual(['DATATYPE', 'VARCHAR']);
      expect(tokens[11]).toEqual(['LPAREN', '(']);
      expect(tokens[12]).toEqual(['NUMBER', '50']);
      expect(tokens[13]).toEqual(['RPAREN', ')']);
      expect(tokens[14]).toEqual(['RPAREN', ')']);
      expect(tokens[15]).toEqual(['SEMICOLON', ';']);
    });
  });

  describe('Comments', () => {
    test('should handle single-line comments', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('-- This is a comment\nCREATE TABLE');
      const tokens = getTokens(parser);
      
      expect(tokens[0]).toEqual(['KEYWORD', 'CREATE']);
      expect(tokens[1]).toEqual(['KEYWORD', 'TABLE']);
    });

    test('should handle multiple comments', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('-- Comment 1\nCREATE TABLE\n-- Comment 2');
      const tokens = getTokens(parser);
      
      expect(tokens[0]).toEqual(['KEYWORD', 'CREATE']);
      expect(tokens[1]).toEqual(['KEYWORD', 'TABLE']);
    });

    test('should handle comments at end of line', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users -- user table');
      const tokens = getTokens(parser);
      
      expect(tokens[0]).toEqual(['KEYWORD', 'CREATE']);
      expect(tokens[1]).toEqual(['KEYWORD', 'TABLE']);
      expect(tokens[2]).toEqual(['IDENTIFIER', 'users']);
    });

    test('should handle empty comments', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE --\nTABLE');
      const tokens = getTokens(parser);
      
      expect(tokens[0]).toEqual(['KEYWORD', 'CREATE']);
      expect(tokens[1]).toEqual(['KEYWORD', 'TABLE']);
    });
  });
});
