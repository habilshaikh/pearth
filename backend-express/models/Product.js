const mongoose = require('mongoose');
const { createModel } = require('./shared');

const productImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    specs: {
      type: String,
      default: '',
      trim: true,
    },
    applications: {
      type: String,
      default: '',
      trim: true,
    },
    qualityNote: {
      type: String,
      default: '',
      trim: true,
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    sort_order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = createModel('Product', productSchema);
