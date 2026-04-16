const contactsService = require('../services/contactsService');
const { validateRequest } = require('../middlewares/errorHandler');

async function list(req, res, next) {
  try {
    const [specialists] = await contactsService.getList(req.query.language);
    res.json(specialists);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const [specialists] = await contactsService.getById(id, req.query.language);
    if (!specialists.length) {
      return res.status(404).json({ error: 'Specialist not found' });
    }
    res.json(specialists[0]);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  if (validateRequest(req, res)) return;
  try {
    const [result] = await contactsService.create(req.body);
    res.json({ id: result.insertId, message: 'Specialist created successfully' });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  if (validateRequest(req, res)) return;
  try {
    await contactsService.update(req.params.id, req.body);
    res.json({ message: 'Specialist updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await contactsService.remove(req.params.id);
    res.json({ message: 'Specialist deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
