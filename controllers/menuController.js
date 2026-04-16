const menuService = require('../services/menuService');

async function getTree(req, res, next) {
  try {
    const tree = await menuService.getTree(req.query.language);
    res.json(tree);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const [result] = await menuService.create(req.body);
    res.json({ id: result.insertId, message: 'Menu item created successfully' });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    await menuService.update(req.params.id, req.body);
    res.json({ message: 'Menu item updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await menuService.remove(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function reorder(req, res, next) {
  try {
    const { items } = req.body;
    await menuService.reorder(items);
    res.json({ message: 'Menu reordered successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTree,
  create,
  update,
  remove,
  reorder,
};
