const db = require('../config/database');
const { safeLang } = require('../constants');

function getList(language) {
  const lang = safeLang(language);
  return db.execute(
    `SELECT id, slug, title_${lang} as title, content_${lang} as content, meta_title_${lang} as meta_title, meta_description_${lang} as meta_description 
     FROM pages 
     WHERE is_active = ? 
     ORDER BY created_at DESC`,
    [true]
  );
}

function getBySlug(slug, language) {
  const lang = safeLang(language);
  return db.execute(
    `SELECT id, slug, title_${lang} as title, content_${lang} as content, meta_title_${lang} as meta_title, meta_description_${lang} as meta_description 
     FROM pages 
     WHERE slug = ? AND is_active = ?`,
    [slug, true]
  );
}

function create(data) {
  const {
    title_kz,
    title_ru,
    slug,
    content_kz,
    content_ru,
    meta_title_kz,
    meta_title_ru,
    meta_description_kz,
    meta_description_ru,
  } = data;
  return db.execute(
    'INSERT INTO pages (title_kz, title_ru, slug, content_kz, content_ru, meta_title_kz, meta_title_ru, meta_description_kz, meta_description_ru) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      title_kz,
      title_ru,
      slug,
      content_kz || '',
      content_ru || '',
      meta_title_kz || null,
      meta_title_ru || null,
      meta_description_kz || null,
      meta_description_ru || null,
    ]
  );
}

function update(id, data) {
  const {
    title_kz,
    title_ru,
    slug,
    content_kz,
    content_ru,
    meta_title_kz,
    meta_title_ru,
    meta_description_kz,
    meta_description_ru,
    is_active,
  } = data;
  return db.execute(
    'UPDATE pages SET title_kz = ?, title_ru = ?, slug = ?, content_kz = ?, content_ru = ?, meta_title_kz = ?, meta_title_ru = ?, meta_description_kz = ?, meta_description_ru = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [
      title_kz,
      title_ru,
      slug,
      content_kz,
      content_ru,
      meta_title_kz,
      meta_title_ru,
      meta_description_kz,
      meta_description_ru,
      is_active,
      id,
    ]
  );
}

function remove(id) {
  return db.execute('DELETE FROM pages WHERE id = ?', [id]);
}

module.exports = {
  getList,
  getBySlug,
  create,
  update,
  remove,
};
