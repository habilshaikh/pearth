const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const { deleteFile } = require('../middleware/upload');
const { ClientLogo } = require('../models');
const { serializeClientLogo } = require('../lib/serializers');

const router = express.Router();

const getClientLogoPayload = (body = {}) => {
  const payload = {};

  if (body.name !== undefined) {
    payload.name = typeof body.name === 'string' ? body.name.trim() : '';
  }

  if (body.imageUrl !== undefined || body.image_url !== undefined) {
    const nextImageUrl = body.imageUrl ?? body.image_url;
    payload.imageUrl = typeof nextImageUrl === 'string' ? nextImageUrl.trim() : '';
  }

  return payload;
};

// GET /api/client-logos - Get all client logos (public)
router.get('/', async (req, res) => {
  try {
    const logos = await ClientLogo.find().sort({ createdAt: 1 }).lean();
    res.json(logos.map(serializeClientLogo));
  } catch (error) {
    console.error('Get client logos error:', error);
    res.status(500).json({ error: 'Failed to get client logos' });
  }
});

// POST /api/client-logos - Create client logo (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const payload = getClientLogoPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    const logo = await ClientLogo.create({
      name: payload.name,
      imageUrl: payload.imageUrl || '',
    });

    res.status(201).json(serializeClientLogo(logo));
  } catch (error) {
    console.error('Create client logo error:', error);
    res.status(500).json({ error: 'Failed to create client logo' });
  }
});

// PUT /api/client-logos/:id - Update client logo (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Logo not found' });
    }

    const logo = await ClientLogo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ error: 'Logo not found' });
    }

    const payload = getClientLogoPayload(req.body);

    if (payload.name !== undefined && !payload.name) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    if (
      payload.imageUrl !== undefined &&
      logo.imageUrl &&
      logo.imageUrl !== payload.imageUrl &&
      logo.imageUrl.startsWith('/uploads/')
    ) {
      deleteFile(logo.imageUrl);
    }

    Object.assign(logo, payload);
    await logo.save();

    res.json(serializeClientLogo(logo));
  } catch (error) {
    console.error('Update client logo error:', error);
    res.status(500).json({ error: 'Failed to update client logo' });
  }
});

// DELETE /api/client-logos/:id - Delete client logo (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Logo not found' });
    }

    const logo = await ClientLogo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ error: 'Logo not found' });
    }

    if (logo.imageUrl && logo.imageUrl.startsWith('/uploads/')) {
      deleteFile(logo.imageUrl);
    }

    await logo.deleteOne();

    res.json({ message: 'Client logo deleted successfully' });
  } catch (error) {
    console.error('Delete client logo error:', error);
    res.status(500).json({ error: 'Failed to delete client logo' });
  }
});

module.exports = router;
