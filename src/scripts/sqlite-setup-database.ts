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
    // Split schema by statements and execute them
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await db.run(statement);
      }
    }
    
    // Read and execute seed data
    const seedPath = path.join(process.cwd(), 'database', 'sqlite-seed.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');
    
    console.log('Inserting seed data...');
    // Split seed data by statements and execute them
    const seedStatements = seedData.split(';').filter(stmt => stmt.trim());
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await db.run(statement);
      }
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

setupDatabase();
