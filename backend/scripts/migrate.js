const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'digital_commerce',
  user: process.env.DB_USER || 'dev',
  password: process.env.DB_PASSWORD || 'dev123',
};

async function runMigrations() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('🔄 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔄 Running migrations...');
    await pool.query(migrationSQL);
    console.log('✅ Migrations completed successfully');

    console.log('🎉 Database setup complete!');
    console.log('📊 You can now start the application servers.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

