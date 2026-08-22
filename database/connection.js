const fs = require('fs');
const path = require('path');
let mongoose;
try {
  mongoose = require('mongoose');
} catch (e) {
  try {
    mongoose = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mongoose'));
  } catch (err) {
    mongoose = null;
  }
}

let isMongoConnected = false;
let memoryDb = {
  complaints: [],
  users: [],
  workOrders: []
};

const DB_FILE = path.join(__dirname, 'data_storage.json');

// Helper to save in-memory db to file for persistence across restarts
const persistMemoryDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting memory DB:', err.message);
  }
};

// Helper to load in-memory db from file
const loadMemoryDb = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(data);
      console.log(`[Storage] Loaded ${memoryDb.complaints?.length || 0} complaints from persistent store.`);
    }
  } catch (err) {
    console.error('Error loading memory DB:', err.message);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicpulse';
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to ${mongoUri}`);
  } catch (err) {
    isMongoConnected = false;
    console.log('[Database] MongoDB not reachable at', mongoUri);
    console.log('[Database] Activating Resilient In-Memory & Local JSON Database Engine (Zero Setup Mode).');
    loadMemoryDb();
  }
};

module.exports = {
  connectDB,
  isUsingMongo: () => isMongoConnected,
  getMemoryDb: () => memoryDb,
  persistMemoryDb,
};
