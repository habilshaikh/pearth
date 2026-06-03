const mongoose = require('mongoose');
const { createModel } = require('./shared');

const homeContentSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: 'Precision CNC Machining',
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default: 'Engineering Excellence Since 1998',
      trim: true,
    },
    heroImage: {
      type: String,
      default: '/uploads/home/hero.jpg',
      trim: true,
    },
    aboutText: {
      type: String,
      default: 'SAI TECH is a leading precision CNC machining company...',
      trim: true,
    },
    aboutImage: {
      type: String,
      default: '/uploads/home/about.jpg',
      trim: true,
    },
    ctaText: {
      type: String,
      default: 'Get Your Custom Quote Today',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = createModel('HomeContent', homeContentSchema);
