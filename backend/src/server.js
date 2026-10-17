const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route handlers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statRoutes = require('./routes/statRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'E-Commerce Full-Stack API',
    uptime: process.uptime()
  });
});

// Auto-seed check on startup
const Product = require('./models/Product');
const autoSeedIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Auto-Seed] No products found in database. Auto-populating initial catalog...');
      const { exec } = require('child_process');
      exec('node src/seeds/seedData.js', (err, stdout, stderr) => {
        if (err) {
          console.error('[Auto-Seed] Error:', stderr);
        } else {
          console.log('[Auto-Seed] Initial data populated successfully!');
        }
      });
    }
  } catch (err) {
    console.error('[Auto-Seed Check Error]:', err.message);
  }
};

setTimeout(autoSeedIfEmpty, 1500);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 E-Commerce Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
