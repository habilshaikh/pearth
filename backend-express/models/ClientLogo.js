const mongoose = require('mongoose');
const { createModel } = require('./shared');

const clientLogoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = createModel('ClientLogo', clientLogoSchema);
