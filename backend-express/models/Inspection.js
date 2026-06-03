const mongoose = require('mongoose');
const { createModel } = require('./shared');

const inspectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    equipment: {
      type: String,
      required: true,
      trim: true,
    },
    capability: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = createModel('Inspection', inspectionSchema);
