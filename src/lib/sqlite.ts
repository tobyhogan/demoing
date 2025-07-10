import initSqlJs from 'sql.js';
import type { Database, SqlJsStatic, SqlValue } from 'sql.js';
import fs from 'fs';
import path from 'path';

// Database file will be stored in the project root
const DB_PATH = path.join(process.cwd(), 'flashcards.db');

class SQLiteConnection {
  private SQL: SqlJsStatic | null = null;
  private db: Database | null = null;

  async connect(): Promise<Database> {
    if (this.db) return this.db;

    try {
      // Initialize sql.js
      if (!this.SQL) {
        this.SQL = await initSqlJs();
      }

      // Check if database file exists
      let fileBuffer: Uint8Array | undefined;
      if (fs.existsSync(DB_PATH)) {
        fileBuffer = fs.readFileSync(DB_PATH);
      }

      // Create or open database
      this.db = new this.SQL.Database(fileBuffer);
      console.log(`Connected to SQLite database at ${DB_PATH}`);
      
      // Enable foreign keys
      this.db.exec('PRAGMA foreign_keys = ON');
      
      return this.db;
    } catch (error) {
      console.error('Error opening SQLite database:', error);
      throw error;
    }
  }

  async run(sql: string, params: unknown[] = []): Promise<{ lastID: number; changes: number }> {
    const db = await this.connect();
    
    const stmt = db.prepare(sql);
    stmt.run(params as SqlValue[]);
    stmt.free();
    
    // Save database to file
    this.saveToFile();
    
    return { 
      lastID: 0, // sql.js doesn't provide lastInsertRowid easily
      changes: 1  // Assume 1 change for simplicity
    };
  }

  async get<T = unknown>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    const db = await this.connect();
    
    const stmt = db.prepare(sql);
    stmt.bind(params as SqlValue[]);
    const hasRow = stmt.step();
    
    if (hasRow) {
      const result = stmt.getAsObject();
      stmt.free();
      return result as T;
    }
    
    stmt.free();
    return undefined;
  }

  async all<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const db = await this.connect();
    
    const stmt = db.prepare(sql);
    stmt.bind(params as SqlValue[]);
    const results: T[] = [];
    
    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }
    
    stmt.free();
    return results;
  }

  private saveToFile(): void {
    if (this.db) {
      const data = this.db.export();
      fs.writeFileSync(DB_PATH, data);
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.saveToFile();
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const db = new SQLiteConnection();
