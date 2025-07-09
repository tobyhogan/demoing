import 'dotenv/config';
import { Pool } from 'pg';

async function createDatabase() {
  // Connect to the default 'postgres' database to create our flashcards database
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default postgres database
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    console.log('Creating flashcards database...');
    
    // Check if database already exists
    const checkDb = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'flashcards'"
    );
    
    if (checkDb.rows.length > 0) {
      console.log('Database "flashcards" already exists!');
    } else {
      // Create the database
      await pool.query('CREATE DATABASE flashcards');
      console.log('Database "flashcards" created successfully!');
    }
    
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createDatabase();
