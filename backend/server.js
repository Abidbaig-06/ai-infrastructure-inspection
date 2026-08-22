const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('../database/connection');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite development
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/work-orders', require('./routes/workOrders'));
app.use('/api/ai-agent', require('./routes/aiAgent'));
app.use('/api/land-assets', require('./routes/landAssets'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CivicPulse AI Municipal Service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('CivicPulse AI API Server is running. Access endpoints via /api/...');
});

// Start Server & Connect DB
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`[CivicPulse Server] Running on http://localhost:${PORT}`);
  });
  try {
    await connectDB();
  } catch (err) {
    console.log('[Database] Error in DB initialization:', err.message);
  }
};

startServer();
