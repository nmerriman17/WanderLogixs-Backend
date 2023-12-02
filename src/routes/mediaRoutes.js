const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const MediaController = require('../controllers/mediaController.js');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

// Setup multer for file upload with a limit of 100MB
const upload = multer({ dest: 'uploads/', limits: { fileSize: 100000000 } });

// Routes definition
router.get('/', authenticateToken, MediaController.getAllMedia);
router.get('/:id', authenticateToken, MediaController.getMediaById);

router.post(
  '/',
  authenticateToken,
  upload.single('file'),
  [body('tripname').notEmpty(), body('tags').optional().isArray()],
  MediaController.uploadMedia
);

router.delete('/:id', authenticateToken, MediaController.deleteMedia);

module.exports = router;
