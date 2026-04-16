const pagesService = require('../services/pagesService');
const { validateRequest } = require('../middlewares/errorHandler');

async function list(req, res, next) {
  try {
    const [pages] = await pagesService.getList(req.query.language);
    res.json(pages);
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const [pages] = await pagesService.getBySlug(slug, req.query.language);
    if (!pages.length) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(pages[0]);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  if (validateRequest(req, res)) return;
  try {
    const [result] = await pagesService.create(req.body);
    res.json({ id: result.insertId, message: 'Page created successfully' });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  if (validateRequest(req, res)) return;
  try {
    await pagesService.update(req.params.id, req.body);
    res.json({ message: 'Page updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await pagesService.remove(req.params.id);
    res.json({ message: 'Page deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getBySlug,
  create,
  update,
  remove,
};
