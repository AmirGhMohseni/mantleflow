require('ts-node/register');
const sequelize = require('./src/config/database').default;

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Successfully connected to PostgreSQL database!');
    
    await sequelize.query(`CREATE TABLE IF NOT EXISTS test_table (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`);
    
    console.log('✅ Database schema is ready');
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

testConnection();
