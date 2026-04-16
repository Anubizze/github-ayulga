const calculatorService = require('../services/calculatorService');

async function getSettings(req, res, next) {
  try {
    const [settings] = await calculatorService.getSettings(req.query.language);
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

async function calculate(req, res, next) {
  try {
    const { expenses, income, subsidy_percent } = req.body;
    if (
      typeof expenses !== 'number' ||
      typeof income !== 'number' ||
      typeof subsidy_percent !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }
    const result = calculatorService.calculate(
      expenses,
      income,
      subsidy_percent
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const { settings } = req.body;
    await calculatorService.updateSettings(settings);
    res.json({ message: 'Calculator settings updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function addSetting(req, res, next) {
  try {
    const [result] = await calculatorService.addSetting(req.body);
    res.json({
      id: result.insertId,
      message: 'Calculator field added successfully',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSettings,
  calculate,
  updateSettings,
  addSetting,
};
