const mongoose = require('mongoose');
const { initializeLocalDatabase } = require('../models/local');

let connectionPromise = null;
let localConnected = false;

const isLocalProvider = () => process.env.DB_PROVIDER === 'local';

const connectToDatabase = async () => {
  if (isLocalProvider()) {
    if (!localConnected) {
      await initializeLocalDatabase();
      localConnected = true;
    }
    return { provider: 'local', readyState: 1 };
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    await connectionPromise;
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};

const disconnectFromDatabase = async () => {
  if (isLocalProvider()) {
    localConnected = false;
    return;
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  connectionPromise = null;
};

const getDatabaseStatus = () => {
  if (isLocalProvider()) {
    return localConnected ? 'connected (local-json)' : 'disconnected';
  }

  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  getDatabaseStatus,
};
