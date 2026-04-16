const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');
const newsController = require('../controllers/newsController');
const db = require('../config/database');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.get('/', asyncHandler(newsController.list));
router.get('/latest', asyncHandler(newsController.latest));

router.get(
  '/image/:imageId',
  asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    const [rows] = await db.execute(
      'SELECT mime_type, file_data FROM uploaded_images WHERE id = ?',
      [imageId]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Image not found' });
    }
    const row = rows[0];
    res.setHeader('Content-Type', row.mime_type || 'application/octet-stream');
    return res.send(row.file_data);
  })
);

router.post(
  '/upload',
  requireAuth,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const [inserted] = await db.execute(
      'INSERT INTO uploaded_images (original_name, mime_type, file_size, file_data) VALUES (?, ?, ?, ?) RETURNING id',
      [req.file.originalname || null, req.file.mimetype, req.file.size, req.file.buffer]
    );
    const imageId = inserted?.[0]?.id;
    const imageUrl = `/api/news/image/${imageId}`;
    return res.json({ imageUrl });
  })
);

router.get('/:id', asyncHandler(newsController.getById));

router.post(
  '/',
  requireAuth,
  [
    body('title_kz').notEmpty().withMessage('Kazakh title is required'),
    body('title_ru').notEmpty().withMessage('Russian title is required'),
    body('content_kz').notEmpty().withMessage('Kazakh content is required'),
    body('content_ru').notEmpty().withMessage('Russian content is required'),
  ],
  asyncHandler(newsController.create)
);
router.put(
  '/:id',
  requireAuth,
  [
    body('title_kz').notEmpty().withMessage('Kazakh title is required'),
    body('title_ru').notEmpty().withMessage('Russian title is required'),
  ],
  asyncHandler(newsController.update)
);
router.delete('/:id', requireAuth, asyncHandler(newsController.remove));

module.exports = router;
