const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// POST /api/upload/:type - Upload single image (admin only)
// type can be: products, services, home, logos
router.post('/:type', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.params.type}/${req.file.filename}`;
    
    res.json({ 
      message: 'File uploaded successfully',
      imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// POST /api/upload/:type/multiple - Upload multiple images (admin only)
router.post('/:type/multiple', authenticateToken, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const images = req.files.map(file => ({
      imageUrl: `/uploads/${req.params.type}/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    res.json({ 
      message: 'Files uploaded successfully',
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

module.exports = router;
