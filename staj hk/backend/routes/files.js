const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
});

router.get('/', authMiddleware, (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) return res.sendStatus(500);
    res.json(files);
  });
});

router.delete('/:filename', authMiddleware, (req, res) => {
  const filepath = path.join('uploads', req.params.filename);
  fs.unlink(filepath, (err) => {
    if (err) return res.status(404).json({ message: 'File not found' });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;
