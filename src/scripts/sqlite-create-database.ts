import path from 'path';
import fs from 'fs';
import { db } from '../lib/sqlite';

async function createDatabase() {
  try {
    console.log('Creating SQLite flashcards database...');
    
    const dbPath = path.join(process.cwd(), 'flashcards.db');
    
    if (fs.existsSync(dbPath)) {
      console.log('Database "flashcards.db" already exists!');
      return;
    }
    
    // Opening the database will create it if it doesn't exist
    await db.connect();
    await db.close();
    
    console.log('Database "flashcards.db" created successfully!');
    
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

createDatabase();
