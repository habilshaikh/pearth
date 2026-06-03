const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { HomeContent } = require('../models');
const { defaultHomeContent } = require('../data/defaultData');
const { parseHomePayload } = require('../lib/payloads');
const { serializeHomeContent } = require('../lib/serializers');

const router = express.Router();

const getOrCreateHomeContent = async () => {
  let content = await HomeContent.findOne().sort({ createdAt: 1 });

  if (!content) {
    content = await HomeContent.create(defaultHomeContent);
  }

  return content;
};

// GET /api/home - Get home content (public)
router.get('/', async (req, res) => {
  try {
    const content = await getOrCreateHomeContent();
    res.json(serializeHomeContent(content));
  } catch (error) {
    console.error('Get home content error:', error);
    res.status(500).json({ error: 'Failed to get home content' });
  }
});

// PUT /api/home - Update home content (admin only)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const updateData = parseHomePayload(req.body);
    let content = await HomeContent.findOne().sort({ createdAt: 1 });

    if (content) {
      Object.assign(content, updateData);
      await content.save();
    } else {
      content = await HomeContent.create({
        ...defaultHomeContent,
        ...updateData,
      });
    }

    res.json(serializeHomeContent(content));
  } catch (error) {
    console.error('Update home content error:', error);
    res.status(500).json({ error: 'Failed to update home content' });
  }
});

module.exports = router;
