const db = require('../config/database');
function getList(_language, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return db.execute(
    `SELECT
      id,
      title_kz as title,
      title_ru as title_ru,
      excerpt_kz as excerpt,
      excerpt_ru as excerpt_ru,
      content_kz as content,
      content_ru as content_ru,
      image,
      category,
      published_at
     FROM news
     WHERE is_active = ? 
     ORDER BY published_at DESC 
     LIMIT ? OFFSET ?`,
    [true, parseInt(limit, 10), parseInt(offset, 10)]
  );
}

function getCount() {
  return db.execute('SELECT COUNT(*) as total FROM news WHERE is_active = ?', [
    true,
  ]);
}

function getLatest(_language, limit = 5) {
  return db.execute(
    `SELECT
      id,
      title_kz as title,
      title_ru as title_ru,
      excerpt_kz as excerpt,
      excerpt_ru as excerpt_ru,
      image,
      category,
      published_at
     FROM news 
     WHERE is_active = ? 
     ORDER BY published_at DESC 
     LIMIT ?`,
    [true, parseInt(limit, 10)]
  );
}

function getById(id, _language) {
  return db.execute(
    `SELECT
      id,
      title_kz as title,
      title_ru as title_ru,
      content_kz as content,
      content_ru as content_ru,
      excerpt_kz as excerpt,
      excerpt_ru as excerpt_ru,
      image,
      category,
      published_at
     FROM news 
     WHERE id = ? AND is_active = ?`,
    [id, true]
  );
}

function create(data) {
  const {
    title_kz,
    title_ru,
    content_kz,
    content_ru,
    excerpt_kz,
    excerpt_ru,
    image,
    category,
    published_at,
  } = data;
  return db.execute(
    'INSERT INTO news (title_kz, title_ru, content_kz, content_ru, excerpt_kz, excerpt_ru, image, category, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, NOW())) RETURNING id',
    [
      title_kz,
      title_ru || title_kz,
      content_kz,
      content_ru || content_kz,
      excerpt_kz || null,
      excerpt_ru || excerpt_kz || null,
      image || null,
      category || null,
      published_at || null,
    ]
  );
}

function update(id, data) {
  const {
    title_kz,
    title_ru,
    content_kz,
    content_ru,
    excerpt_kz,
    excerpt_ru,
    image,
    category,
    is_active,
    published_at,
  } = data;
  return db.execute(
    'UPDATE news SET title_kz = ?, title_ru = ?, content_kz = ?, content_ru = ?, excerpt_kz = ?, excerpt_ru = ?, image = ?, category = ?, is_active = ?, published_at = COALESCE(?, published_at), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [
      title_kz,
      title_ru || title_kz,
      content_kz,
      content_ru || content_kz,
      excerpt_kz,
      excerpt_ru || excerpt_kz,
      image,
      category,
      is_active,
      published_at || null,
      id,
    ]
  );
}

function remove(id) {
  return db.execute('DELETE FROM news WHERE id = ?', [id]);
}

module.exports = {
  getList,
  getCount,
  getLatest,
  getById,
  create,
  update,
  remove,
};
