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

describe('NoobSQLParser - Parser/AST', () => {
  describe('Basic Table Structure', () => {
    test('should parse simple table with one INT column', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (id INT);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts.length).toBe(1);
      expect(asts[0].tableName).toBe('users');
      expect(asts[0].column.length).toBe(1);
      expect(asts[0].column[0].name).toBe('id');
      expect(asts[0].column[0].dataType).toBe('INT');
      expect(asts[0].column[0].constraint).toEqual([]);
      expect(asts[0].relation).toEqual([]);
    });

    test('should parse table without semicolon', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (id INT)');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts.length).toBe(1);
      expect(asts[0].tableName).toBe('users');
    });

    test('should parse multiple columns', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (id INT, name VARCHAR(50), age INT);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column.length).toBe(3);
      expect(asts[0].column[0].name).toBe('id');
      expect(asts[0].column[1].name).toBe('name');
      expect(asts[0].column[2].name).toBe('age');
    });
  });

  describe('Data Types', () => {
    test('should parse VARCHAR with size', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (name VARCHAR(100));');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].tableName).toBe('users');
      expect(asts[0].column[0].name).toBe('name');
      expect(asts[0].column[0].dataType).toBe('VARCHAR(100)');
    });

    test('should parse TEXT data type', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE posts (content TEXT);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column[0].dataType).toBe('TEXT');
    });

    test('should parse BOOLEAN data type', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (active BOOLEAN);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column[0].dataType).toBe('BOOLEAN');
    });
  });

  describe('Constraints', () => {
    test('should parse column with PRIMARY KEY constraint', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (id INT PRIMARY KEY);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column[0].name).toBe('id');
      expect(asts[0].column[0].dataType).toBe('INT');
      expect(asts[0].column[0].constraint).toEqual(['PRIMARY KEY']);
    });

    test('should parse NOT NULL constraint', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (email VARCHAR(255) NOT NULL);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column[0].name).toBe('email');
      expect(asts[0].column[0].dataType).toBe('VARCHAR(255)');
      expect(asts[0].column[0].constraint).toEqual(['NOT NULL']);
    });

    test('should parse AUTO_INCREMENT constraint', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (id INT AUTO_INCREMENT);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column[0].constraint).toEqual(['AUTO_INCREMENT']);
    });

    test('should parse multiple constraints on single column', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column[0].constraint).toEqual(['PRIMARY KEY', 'AUTO_INCREMENT']);
    });

    test('should parse multiple columns with different constraints', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE products (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, price INT);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column.length).toBe(3);
      expect(asts[0].column[0].constraint).toEqual(['PRIMARY KEY', 'AUTO_INCREMENT']);
      expect(asts[0].column[1].constraint).toEqual(['NOT NULL']);
      expect(asts[0].column[2].constraint).toEqual([]);
    });
  });

  describe('Complex Tables', () => {
    test('should parse complete user table with multiple columns and constraints', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(50) NOT NULL,
          email VARCHAR(100) NOT NULL,
          age INT,
          bio TEXT,
          is_active BOOLEAN
        );
      `);
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].tableName).toBe('users');
      expect(asts[0].column.length).toBe(6);
      
      expect(asts[0].column[0].name).toBe('id');
      expect(asts[0].column[0].dataType).toBe('INT');
      expect(asts[0].column[0].constraint).toEqual(['PRIMARY KEY', 'AUTO_INCREMENT']);
      
      expect(asts[0].column[1].name).toBe('username');
      expect(asts[0].column[1].dataType).toBe('VARCHAR(50)');
      expect(asts[0].column[1].constraint).toEqual(['NOT NULL']);
      
      expect(asts[0].column[2].name).toBe('email');
      expect(asts[0].column[2].dataType).toBe('VARCHAR(100)');
      expect(asts[0].column[2].constraint).toEqual(['NOT NULL']);
      
      expect(asts[0].column[3].name).toBe('age');
      expect(asts[0].column[3].dataType).toBe('INT');
      expect(asts[0].column[3].constraint).toEqual([]);
      
      expect(asts[0].column[4].name).toBe('bio');
      expect(asts[0].column[4].dataType).toBe('TEXT');
      
      expect(asts[0].column[5].name).toBe('is_active');
      expect(asts[0].column[5].dataType).toBe('BOOLEAN');
    });
  });

  describe('Foreign Key Relations', () => {
    test('should parse single FOREIGN KEY constraint', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText(`
        CREATE TABLE posts (
          id INT PRIMARY KEY,
          user_id INT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].tableName).toBe('posts');
      expect(asts[0].column.length).toBe(2);
      expect(asts[0].relation.length).toBe(1);
      
      const relationKey = Object.keys(asts[0].relation[0])[0];
      expect(relationKey).toBe('fk_posts_users');
      
      const relation = asts[0].relation[0][relationKey as string];
      expect(relation.from.tableName).toBe('posts');
      expect(relation.from.columnName).toBe('user_id');
      expect(relation.to.tableName).toBe('users');
      expect(relation.to.columnName).toBe('id');
    });

    test('should parse multiple FOREIGN KEY constraints', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText(`
        CREATE TABLE comments (
          id INT PRIMARY KEY,
          post_id INT NOT NULL,
          user_id INT NOT NULL,
          FOREIGN KEY (post_id) REFERENCES posts(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].tableName).toBe('comments');
      expect(asts[0].column.length).toBe(3);
      expect(asts[0].relation.length).toBe(2);
      
      const firstRelationKey = Object.keys(asts[0].relation[0])[0];
      expect(firstRelationKey).toBe('fk_comments_posts');
      const firstRelation = asts[0].relation[0][firstRelationKey as string];
      expect(firstRelation.from.columnName).toBe('post_id');
      expect(firstRelation.to.tableName).toBe('posts');
      expect(firstRelation.to.columnName).toBe('id');
      
      const secondRelationKey = Object.keys(asts[0].relation[1])[0];
      expect(secondRelationKey).toBe('fk_comments_users');
      const secondRelation = asts[0].relation[1][secondRelationKey as string];
      expect(secondRelation.from.columnName).toBe('user_id');
      expect(secondRelation.to.tableName).toBe('users');
      expect(secondRelation.to.columnName).toBe('id');
    });

    test('should parse table without foreign keys', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (id INT PRIMARY KEY);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].relation).toEqual([]);
    });
  });

  describe('Multiple Table Statements', () => {
    test('should parse multiple CREATE TABLE statements', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(50) NOT NULL
        );
        
        CREATE TABLE posts (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(200) NOT NULL,
          user_id INT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts.length).toBe(2);
      
      expect(asts[0].tableName).toBe('users');
      expect(asts[0].column.length).toBe(2);
      expect(asts[0].relation.length).toBe(0);
      
      expect(asts[1].tableName).toBe('posts');
      expect(asts[1].column.length).toBe(3);
      expect(asts[1].relation.length).toBe(1);
    });

    test('should parse complex multi-table schema', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(50) NOT NULL,
          email VARCHAR(100) NOT NULL
        );
        
        CREATE TABLE posts (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(200) NOT NULL,
          content TEXT,
          user_id INT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
        
        CREATE TABLE comments (
          id INT PRIMARY KEY AUTO_INCREMENT,
          content TEXT NOT NULL,
          post_id INT NOT NULL,
          user_id INT NOT NULL,
          FOREIGN KEY (post_id) REFERENCES posts(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts.length).toBe(3);
      
      expect(asts[0].tableName).toBe('users');
      expect(asts[0].column.length).toBe(3);
      expect(asts[0].relation.length).toBe(0);
      
      expect(asts[1].tableName).toBe('posts');
      expect(asts[1].column.length).toBe(4);
      expect(asts[1].relation.length).toBe(1);
      
      expect(asts[2].tableName).toBe('comments');
      expect(asts[2].column.length).toBe(4);
      expect(asts[2].relation.length).toBe(2);
    });
  });

  describe('DATE Data Type', () => {
    test('should parse DATE data type', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE users (created_at DATE);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column[0].dataType).toBe('DATE');
    });

    test('should parse table with multiple DATE columns', () => {
      const parser = new NoobSQLParser();
      parser.SetSQLText('CREATE TABLE posts (created_at DATE, updated_at DATE);');
      parser.Parse();
      const asts = getASTs(parser);
      
      expect(asts[0].column.length).toBe(2);
      expect(asts[0].column[0].dataType).toBe('DATE');
      expect(asts[0].column[1].dataType).toBe('DATE');
    });
  });
});

describe('NoobSQLParser - Error Handling', () => {
  test('should throw error for missing table name', () => {
    const parser = new NoobSQLParser();
    parser.SetSQLText('CREATE TABLE (id INT);');
    
    expect(() => parser.Parse()).toThrow('Expected Table Name');
  });

  test('should throw error for missing opening parenthesis', () => {
    const parser = new NoobSQLParser();
    parser.SetSQLText('CREATE TABLE users id INT);');
    
    expect(() => parser.Parse()).toThrow('Expected (');
  });

  test('should throw error for invalid column name', () => {
    const parser = new NoobSQLParser();
    parser.SetSQLText('CREATE TABLE users (123 INT);');
    
    expect(() => parser.Parse()).toThrow('Invalid Column Name');
  });

  test('should throw error for missing data type', () => {
    const parser = new NoobSQLParser();
    parser.SetSQLText('CREATE TABLE users (id PRIMARY KEY);');
    
    expect(() => parser.Parse()).toThrow('Invalid Data Type');
  });

  test('should throw error for missing closing parenthesis', () => {
    const parser = new NoobSQLParser();
    parser.SetSQLText('CREATE TABLE users (id INT;');
    
    expect(() => parser.Parse()).toThrow();
  });
});