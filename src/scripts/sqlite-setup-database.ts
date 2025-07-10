import { db } from '../lib/sqlite';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  try {
    console.log('Setting up SQLite database...');
    
    // Connect to database
    await db.connect();
    
    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'database', 'sqlite-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Creating tables...');
    // Execute the entire schema at once using exec
    const database = await db.connect();
    database.exec(schema);
    
    // Read and execute seed data
    const seedPath = path.join(process.cwd(), 'database', 'sqlite-seed.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');
    
    console.log('Inserting seed data...');
    // Execute the entire seed data at once using exec
    database.exec(seedData);
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

setupDatabase();
