const db = require('../config/database');
const { safeLang } = require('../constants');

function getList(language) {
  const lang = safeLang(language);
  return db.execute(
    `SELECT id, name_${lang} as name, phone, email, specialization_${lang} as specialization, photo 
     FROM specialists 
     WHERE is_active = ? 
     ORDER BY order_index ASC, created_at DESC`,
    [true]
  );
}

function getById(id, language) {
  const lang = safeLang(language);
  return db.execute(
    `SELECT id, name_${lang} as name, phone, email, specialization_${lang} as specialization, photo 
     FROM specialists 
     WHERE id = ? AND is_active = ?`,
    [id, true]
  );
}

function create(data) {
  const {
    name_kz,
    name_ru,
    phone,
    email,
    specialization_kz,
    specialization_ru,
    photo,
    order_index,
  } = data;
  return db.execute(
    'INSERT INTO specialists (name_kz, name_ru, phone, email, specialization_kz, specialization_ru, photo, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      name_kz,
      name_ru,
      phone,
      email,
      specialization_kz || null,
      specialization_ru || null,
      photo || null,
      order_index ?? 0,
    ]
  );
}

function update(id, data) {
  const {
    name_kz,
    name_ru,
    phone,
    email,
    specialization_kz,
    specialization_ru,
    photo,
    order_index,
    is_active,
  } = data;
  return db.execute(
    'UPDATE specialists SET name_kz = ?, name_ru = ?, phone = ?, email = ?, specialization_kz = ?, specialization_ru = ?, photo = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [
      name_kz,
      name_ru,
      phone,
      email,
      specialization_kz,
      specialization_ru,
      photo,
      order_index,
      is_active,
      id,
    ]
  );
}

function remove(id) {
  return db.execute('DELETE FROM specialists WHERE id = ?', [id]);
}

module.exports = {
  getList,
  getById,
  create,
  update,
  remove,
};
