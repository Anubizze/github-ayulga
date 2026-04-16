const db = require('../config/database');

async function findUserByUsername(username) {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0] || null;
}

module.exports = {
  findUserByUsername,
};
