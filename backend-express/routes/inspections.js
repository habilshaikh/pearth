const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const { Inspection } = require('../models');
const { parseInspectionPayload } = require('../lib/payloads');
const { serializeInspection } = require('../lib/serializers');

const router = express.Router();

// GET /api/inspections - Get all inspections (public)
router.get('/', async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ createdAt: -1 }).lean();
    res.json(inspections.map(serializeInspection));
  } catch (error) {
    console.error('Get inspections error:', error);
    res.status(500).json({ error: 'Failed to get inspections' });
  }
});

// GET /api/inspections/:id - Get single inspection (public)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    const inspection = await Inspection.findById(req.params.id).lean();
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    res.json(serializeInspection(inspection));
  } catch (error) {
    console.error('Get inspection error:', error);
    res.status(500).json({ error: 'Failed to get inspection' });
  }
});

// POST /api/inspections - Create inspection (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const payload = parseInspectionPayload(req.body);

    if (!payload.name || !payload.equipment) {
      return res.status(400).json({ error: 'Name and equipment are required' });
    }

    const inspection = await Inspection.create(payload);
    res.status(201).json(serializeInspection(inspection));
  } catch (error) {
    console.error('Create inspection error:', error);
    res.status(500).json({ error: 'Failed to create inspection' });
  }
});

// PUT /api/inspections/:id - Update inspection (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    const payload = parseInspectionPayload(req.body);

    Object.assign(inspection, payload);
    await inspection.save();

    res.json(serializeInspection(inspection));
  } catch (error) {
    console.error('Update inspection error:', error);
    res.status(500).json({ error: 'Failed to update inspection' });
  }
});

// DELETE /api/inspections/:id - Delete inspection (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    await inspection.deleteOne();

    res.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    console.error('Delete inspection error:', error);
    res.status(500).json({ error: 'Failed to delete inspection' });
  }
});

module.exports = router;
