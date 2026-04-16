require('dotenv').config();
const app = require('./app');
const db = require('./config/database');
const { seedNewsFromStaticJson } = require('./services/newsSeedService');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 5000;

async function ensureUploadedImagesTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS uploaded_images (
      id BIGSERIAL PRIMARY KEY,
      original_name VARCHAR(255),
      mime_type VARCHAR(100) NOT NULL,
      file_size INTEGER NOT NULL,
      file_data BYTEA NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function ensureAdminPasswordFromEnv() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return;

  if (adminPassword.length < 12) {
    console.warn('⚠️  ADMIN_PASSWORD is set but shorter than 12 characters');
  }

  const result = await db.query('SELECT password FROM users WHERE username = $1 LIMIT 1', ['admin']);
  const adminUser = result?.rows?.[0];

  if (!adminUser) {
    console.warn('⚠️  Admin user not found, skip ADMIN_PASSWORD sync');
    return;
  }

  const alreadyMatches = await bcrypt.compare(adminPassword, adminUser.password);
  if (alreadyMatches) {
    console.log('✅ Admin password already matches ADMIN_PASSWORD');
    return;
  }

  const newHash = await bcrypt.hash(adminPassword, 10);
  await db.query('UPDATE users SET password = $1 WHERE username = $2', [newHash, 'admin']);
  console.log('✅ Admin password updated from ADMIN_PASSWORD');
}

db.getConnection()
  .then(async (conn) => {
    console.log('✅ Database connected successfully');
    conn.release();
    try {
      await ensureUploadedImagesTable();
    } catch (e) {
      console.warn('⚠️  uploaded_images table init failed:', e.message);
    }
    try {
      await ensureAdminPasswordFromEnv();
    } catch (e) {
      console.warn('⚠️  Admin password sync failed:', e.message);
    }
    if (process.env.AUTO_SEED_STATIC_NEWS !== 'false') {
      try {
        await seedNewsFromStaticJson();
      } catch (e) {
        console.warn('⚠️  Static news seed failed:', e.message);
      }
    }
  })
  .catch((err) => {
    console.warn('⚠️  Database connection failed:', err.message);
    console.warn('   Server will run but DB-dependent routes will return errors');
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
