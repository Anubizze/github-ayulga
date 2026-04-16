const express = require('express');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');
const calculatorController = require('../controllers/calculatorController');

const router = express.Router();

router.get('/settings', asyncHandler(calculatorController.getSettings));
router.post('/calculate', asyncHandler(calculatorController.calculate));

router.put(
  '/settings',
  requireAuth,
  asyncHandler(calculatorController.updateSettings)
);
router.post(
  '/settings',
  requireAuth,
  asyncHandler(calculatorController.addSetting)
);

module.exports = router;
