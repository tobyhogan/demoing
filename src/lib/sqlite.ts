import sqlite3 from 'sqlite3';
import path from 'path';

// Database file will be stored in the project root
const DB_PATH = path.join(process.cwd(), 'flashcards.db');

// Enable verbose mode for debugging
const Database = sqlite3.verbose().Database;

class SQLiteConnection {
  private db: sqlite3.Database | null = null;

  async connect(): Promise<sqlite3.Database> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      this.db = new Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening SQLite database:', err);
          reject(err);
        } else {
          console.log(`Connected to SQLite database at ${DB_PATH}`);
          // Enable foreign keys
          this.db!.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
              console.error('Error enabling foreign keys:', err);
              reject(err);
            } else {
              resolve(this.db!);
            }
          });
        }
      });
    });
  }

  async run(sql: string, params: unknown[] = []): Promise<{ lastID: number; changes: number }> {
    const db = await this.connect();
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get<T = unknown>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    const db = await this.connect();
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  async all<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const db = await this.connect();
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  async close(): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      this.db!.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.db = null;
          resolve();
        }
      });
    });
  }
}

// Export singleton instance
export const db = new SQLiteConnection();
