const express = require('express');
const { body } = require('express-validator');
const { asyncHandler } = require('../middlewares/errorHandler');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  asyncHandler(authController.login)
);

router.get('/verify', asyncHandler(authController.verify));

module.exports = router;
