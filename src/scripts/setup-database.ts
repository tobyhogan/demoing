import 'dotenv/config';
import { pool } from '../lib/database';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Creating tables...');
    await pool.query(schema);
    
    // Read and execute seed data
    const seedPath = path.join(process.cwd(), 'database', 'seed.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');
    
    console.log('Inserting seed data...');
    await pool.query(seedData);
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
