const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const { deleteFile } = require('../middleware/upload');
const { Product } = require('../models');
const { parseProductPayload } = require('../lib/payloads');
const { serializeImage, serializeProduct } = require('../lib/serializers');

const router = express.Router();

const deleteRemovedProductImages = (existingImages, nextImages) => {
  const nextImageUrls = new Set(nextImages.map((image) => image.imageUrl));

  existingImages.forEach((image) => {
    if (image.imageUrl.startsWith('/uploads/') && !nextImageUrls.has(image.imageUrl)) {
      deleteFile(image.imageUrl);
    }
  });
};

// GET /api/products - Get all products (public)
router.get('/', async (req, res) => {
  try {
    // ✅ sort_order first, fallback to createdAt
    const products = await Product.find().sort({ sort_order: 1, createdAt: 1 }).lean();
    res.json(products.map(serializeProduct));
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// ✅ PUT /api/products/reorder - Reorder products (admin only)
// IMPORTANT: This route must be defined BEFORE /:id routes
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { order } = req.body;

    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'order must be an array' });
    }

    const bulkOps = order
      .filter(({ id }) => mongoose.Types.ObjectId.isValid(id))
      .map(({ id, sort_order }) => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(id) },
          update: { $set: { sort_order } },
        },
      }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Reorder products error:', error);
    res.status(500).json({ error: 'Failed to reorder products' });
  }
});

// GET /api/products/:id - Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(serializeProduct(product));
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// POST /api/products - Create product (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const payload = parseProductPayload(req.body);

    if (!payload.name || !payload.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    // ✅ New product gets highest sort_order (goes to end)
    const count = await Product.countDocuments();
    payload.sort_order = count;

    const product = await Product.create(payload);
    res.status(201).json(serializeProduct(product));
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const payload = parseProductPayload(req.body);

    if (payload.images !== undefined) {
      deleteRemovedProductImages(product.images, payload.images);
    }

    Object.assign(product, payload);
    await product.save();

    res.json(serializeProduct(product));
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.images.forEach((image) => {
      if (image.imageUrl.startsWith('/uploads/')) {
        deleteFile(image.imageUrl);
      }
    });

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// POST /api/products/:id/images - Add image to product (admin only)
router.post('/:id/images', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { imageUrl, image_url } = req.body;
    const nextImageUrl = imageUrl || image_url;

    if (!nextImageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.images.push({ imageUrl: nextImageUrl });
    await product.save();

    const image = product.images[product.images.length - 1];
    res.status(201).json(serializeImage(image));
  } catch (error) {
    console.error('Add product image error:', error);
    res.status(500).json({ error: 'Failed to add product image' });
  }
});

// DELETE /api/products/images/:imageId - Delete product image (admin only)
router.delete('/images/:imageId', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.imageId)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const product = await Product.findOne({ 'images._id': req.params.imageId });
    if (!product) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = product.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (image.imageUrl.startsWith('/uploads/')) {
      deleteFile(image.imageUrl);
    }

    product.images.pull({ _id: req.params.imageId });
    await product.save();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete product image error:', error);
    res.status(500).json({ error: 'Failed to delete product image' });
  }
});

module.exports = router;
