const db = require('../config/database');
const { safeLang } = require('../constants');

function buildMenuTree(items, parentId = null) {
  return items
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      children: buildMenuTree(items, item.id),
    }));
}

async function getTree(language) {
  const lang = safeLang(language);
  const [menuItems] = await db.execute(
    `SELECT id, title_${lang} as title, slug, url, parent_id, order_index 
     FROM menu_items 
     WHERE is_active = ? 
     ORDER BY parent_id ASC, order_index ASC`,
    [true]
  );
  return buildMenuTree(menuItems);
}

function create(data) {
  const { title_kz, title_ru, slug, url, parent_id, order_index } = data;
  return db.execute(
    'INSERT INTO menu_items (title_kz, title_ru, slug, url, parent_id, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [title_kz, title_ru, slug, url, parent_id ?? null, order_index ?? 0]
  );
}

function update(id, data) {
  const { title_kz, title_ru, slug, url, parent_id, order_index, is_active } =
    data;
  return db.execute(
    'UPDATE menu_items SET title_kz = ?, title_ru = ?, slug = ?, url = ?, parent_id = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title_kz, title_ru, slug, url, parent_id, order_index, is_active, id]
  );
}

function remove(id) {
  return db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
}

async function reorder(items) {
  for (const item of items) {
    await db.execute(
      'UPDATE menu_items SET order_index = ?, parent_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [item.order_index, item.parent_id, item.id]
    );
  }
}

module.exports = {
  getTree,
  create,
  update,
  remove,
  reorder,
};
