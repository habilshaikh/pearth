const mongoose = require('mongoose');

const createModel = (name, schema) => mongoose.models[name] || mongoose.model(name, schema);

module.exports = { createModel };
