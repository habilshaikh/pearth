const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const { deleteFile } = require('../middleware/upload');
const { Machine } = require('../models');
const { parseMachinePayload } = require('../lib/payloads');
const { serializeMachine } = require('../lib/serializers');

const router = express.Router();

// GET /api/machines - Get all machines (public)
router.get('/', async (req, res) => {
  try {
    const machines = await Machine.find().sort({ sort_order: 1, createdAt: 1 }).lean();
    res.json(machines.map(serializeMachine));
  } catch (error) {
    console.error('Get machines error:', error);
    res.status(500).json({ error: 'Failed to get machines' });
  }
});

// PUT /api/machines/reorder - Reorder machines (admin only)
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
      await Machine.bulkWrite(bulkOps);
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Reorder machines error:', error);
    res.status(500).json({ error: 'Failed to reorder machines' });
  }
});

// GET /api/machines/:id - Get single machine (public)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const machine = await Machine.findById(req.params.id).lean();
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    res.json(serializeMachine(machine));
  } catch (error) {
    console.error('Get machine error:', error);
    res.status(500).json({ error: 'Failed to get machine' });
  }
});

// POST /api/machines - Create machine (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const payload = parseMachinePayload(req.body);

    if (!payload.name || !payload.capacity) {
      return res.status(400).json({ error: 'Name and capacity are required' });
    }

    const count = await Machine.countDocuments();
    payload.sort_order = count;

    const machine = await Machine.create(payload);
    res.status(201).json(serializeMachine(machine));
  } catch (error) {
    console.error('Create machine error:', error);
    res.status(500).json({ error: 'Failed to create machine' });
  }
});

// PUT /api/machines/:id - Update machine (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const payload = parseMachinePayload(req.body);

    if (
      payload.imageUrl !== undefined &&
      machine.imageUrl &&
      machine.imageUrl !== payload.imageUrl &&
      machine.imageUrl.startsWith('/uploads/')
    ) {
      deleteFile(machine.imageUrl);
    }

    Object.assign(machine, payload);
    await machine.save();

    res.json(serializeMachine(machine));
  } catch (error) {
    console.error('Update machine error:', error);
    res.status(500).json({ error: 'Failed to update machine' });
  }
});

// DELETE /api/machines/:id - Delete machine (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    if (machine.imageUrl && machine.imageUrl.startsWith('/uploads/')) {
      deleteFile(machine.imageUrl);
    }

    await machine.deleteOne();

    res.json({ message: 'Machine deleted successfully' });
  } catch (error) {
    console.error('Delete machine error:', error);
    res.status(500).json({ error: 'Failed to delete machine' });
  }
});

module.exports = router;
