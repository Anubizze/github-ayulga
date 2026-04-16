const newsService = require('../services/newsService');
const { validateRequest } = require('../middlewares/errorHandler');

async function list(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const language = req.query.language;
    const [news] = await newsService.getList(language, page, limit);
    const [countResult] = await newsService.getCount();
    const total = countResult[0].total;

    res.json({
      news,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function latest(req, res, next) {
  try {
    const { limit = 5 } = req.query;
    const [news] = await newsService.getLatest(req.query.language, limit);
    res.json(news);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const [news] = await newsService.getById(id, req.query.language);
    if (!news.length) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(news[0]);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  if (validateRequest(req, res)) return;
  try {
    const [result] = await newsService.create(req.body);
    const createdId = result?.[0]?.id;
    res.json({ id: createdId, message: 'News created successfully' });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  if (validateRequest(req, res)) return;
  try {
    await newsService.update(req.params.id, req.body);
    res.json({ message: 'News updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await newsService.remove(req.params.id);
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  latest,
  getById,
  create,
  update,
  remove,
};
