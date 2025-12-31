const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'mantleuser',
  password: 'securepass123',
  database: 'mantleflow'
});

client.connect()
  .then(() => {
    console.log('✅ Successfully connected to PostgreSQL database!');
    return client.query('SELECT NOW() as current_time');
  })
  .then(res => {
    console.log('🕒 Current time from database:', res.rows[0].current_time);
    return client.end();
  })
  .catch(err => {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  });
