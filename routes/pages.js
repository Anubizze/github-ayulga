const express = require('express');
const { body } = require('express-validator');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');
const pagesController = require('../controllers/pagesController');

const router = express.Router();

router.get('/', asyncHandler(pagesController.list));
router.get('/:slug', asyncHandler(pagesController.getBySlug));

router.post(
  '/',
  requireAuth,
  [
    body('title_kz').notEmpty().withMessage('Kazakh title is required'),
    body('title_ru').notEmpty().withMessage('Russian title is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
  ],
  asyncHandler(pagesController.create)
);
router.put(
  '/:id',
  requireAuth,
  [
    body('title_kz').notEmpty().withMessage('Kazakh title is required'),
    body('title_ru').notEmpty().withMessage('Russian title is required'),
  ],
  asyncHandler(pagesController.update)
);
router.delete('/:id', requireAuth, asyncHandler(pagesController.remove));

module.exports = router;
