const express = require('express');
const { body } = require('express-validator');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');
const contactsController = require('../controllers/contactsController');

const router = express.Router();

router.get('/', asyncHandler(contactsController.list));
router.get('/:id', asyncHandler(contactsController.getById));

router.post(
  '/',
  requireAuth,
  [
    body('name_kz').notEmpty().withMessage('Kazakh name is required'),
    body('name_ru').notEmpty().withMessage('Russian name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  asyncHandler(contactsController.create)
);
router.put(
  '/:id',
  requireAuth,
  [
    body('name_kz').notEmpty().withMessage('Kazakh name is required'),
    body('name_ru').notEmpty().withMessage('Russian name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  asyncHandler(contactsController.update)
);
router.delete('/:id', requireAuth, asyncHandler(contactsController.remove));

module.exports = router;
