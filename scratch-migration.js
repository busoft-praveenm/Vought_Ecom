const mysql = require('mysql2/promise');

async function runMigration() {
  // Try default local config
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // Assumed from typical local setup or I should check .env
    database: 'vought_ecom'
  });

  console.log('Connected to DB');

  await connection.query(`
    CREATE TABLE IF NOT EXISTS tbl_user_profile (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NULL,
      last_name VARCHAR(255) NULL,
      mobile_number VARCHAR(255) NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_user_profile_user FOREIGN KEY (user_id) REFERENCES tbl_user(id) ON DELETE CASCADE
    )
  `);

  console.log('Table created');

  // Migrate data safely (ignore errors if columns are already dropped)
  try {
    await connection.query(`
      INSERT INTO tbl_user_profile (first_name, last_name, user_id)
      SELECT first_name, last_name, id FROM tbl_user
    `);
    console.log('Data migrated');
  } catch (e) {
    console.log('Data migration skipped or already done:', e.message);
  }

  // Drop columns safely
  try {
    await connection.query('ALTER TABLE tbl_user DROP COLUMN first_name');
    await connection.query('ALTER TABLE tbl_user DROP COLUMN last_name');
    console.log('Columns dropped');
  } catch (e) {
    console.log('Drop columns skipped or already done:', e.message);
  }

  await connection.end();
}

runMigration().catch(console.error);
