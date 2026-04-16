const fs = require('fs');
const path = require('path');
const db = require('../config/database');

function makeHtmlFromExcerpt(excerpt) {
  const text = (excerpt || '').trim();
  if (!text) return '<p></p>';
  return `<p>${text}</p>`;
}

async function seedNewsFromStaticJson() {
  const staticNewsPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'news-data.json');

  if (!fs.existsSync(staticNewsPath)) {
    console.warn('Static news-data.json not found, skip seed');
    return;
  }

  const raw = fs.readFileSync(staticNewsPath, 'utf8');
  const items = JSON.parse(raw);

  if (!Array.isArray(items) || items.length === 0) return;

  for (const item of items) {
    if (!item || !item.id || !item.title) continue;

    const titleKz = item.title;
    const titleRu = item.title_ru || item.title;
    const excerptKz = item.excerpt || '';
    const excerptRu = item.excerpt_ru || excerptKz;
    const contentKz = makeHtmlFromExcerpt(excerptKz);
    const contentRu = makeHtmlFromExcerpt(excerptRu);
    const image = item.image || null;
    const category = item.category || 'Жаңалықтар';

    await db.query(
      `INSERT INTO news (
        id, title_kz, title_ru, content_kz, content_ru, excerpt_kz, excerpt_ru,
        image, category, is_active, published_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, NOW())
      ON CONFLICT (id) DO NOTHING`,
      [item.id, titleKz, titleRu, contentKz, contentRu, excerptKz, excerptRu, image, category]
    );
  }

  await db.query(
    `SELECT setval(
      pg_get_serial_sequence('news', 'id'),
      COALESCE((SELECT MAX(id) FROM news), 1),
      true
    )`
  );

  console.log(`Seeded ${items.length} static news items into PostgreSQL`);
}

module.exports = { seedNewsFromStaticJson };
