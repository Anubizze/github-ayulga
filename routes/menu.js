const express = require('express');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', asyncHandler(menuController.getTree));

router.post('/', requireAuth, asyncHandler(menuController.create));
router.put('/reorder', requireAuth, asyncHandler(menuController.reorder));
router.put('/:id', requireAuth, asyncHandler(menuController.update));
router.delete('/:id', requireAuth, asyncHandler(menuController.remove));

module.exports = router;
