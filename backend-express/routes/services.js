const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const { deleteFile } = require('../middleware/upload');
const { Service } = require('../models');
const { parseServicePayload } = require('../lib/payloads');
const { serializeService } = require('../lib/serializers');

const router = express.Router();

// GET /api/services - Get all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ sort_order: 1, createdAt: 1 }).lean();
    res.json(services.map(serializeService));
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

// PUT /api/services/reorder - Reorder services (admin only)
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
      await Service.bulkWrite(bulkOps);
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Reorder services error:', error);
    res.status(500).json({ error: 'Failed to reorder services' });
  }
});

// GET /api/services/:id - Get single service (public)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = await Service.findById(req.params.id).lean();
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(serializeService(service));
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to get service' });
  }
});

// POST /api/services - Create service (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const payload = parseServicePayload(req.body);

    if (!payload.name || !payload.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const count = await Service.countDocuments();
    payload.sort_order = count;

    const service = await Service.create(payload);
    res.status(201).json(serializeService(service));
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// PUT /api/services/:id - Update service (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const payload = parseServicePayload(req.body);

    if (
      payload.imageUrl !== undefined &&
      service.imageUrl &&
      service.imageUrl !== payload.imageUrl &&
      service.imageUrl.startsWith('/uploads/')
    ) {
      deleteFile(service.imageUrl);
    }

    Object.assign(service, payload);
    await service.save();

    res.json(serializeService(service));
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE /api/services/:id - Delete service (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.imageUrl && service.imageUrl.startsWith('/uploads/')) {
      deleteFile(service.imageUrl);
    }

    await service.deleteOne();

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
