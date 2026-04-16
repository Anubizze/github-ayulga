const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'auylga_kz',
  max: parseInt(process.env.DB_POOL_MAX || '10', 10),
});

function convertQuestionParams(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

async function execute(sql, params = []) {
  const convertedSql = convertQuestionParams(sql);
  const result = await pool.query(convertedSql, params);
  return [result.rows];
}

async function getConnection() {
  return pool.connect();
}

module.exports = {
  execute,
  getConnection,
  query: (sql, params = []) => pool.query(sql, params),
};
