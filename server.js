const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const nutritionRoutes = require('./routes/nutritionRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', // Local development
    process.env.FRONTEND_URL || 'https://nutrivision.vercel.app', // URL frontend production
    /\.vercel\.app$/ // Allow all Vercel subdomains
  ], 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const connectDB = async () => {
  // Try direct connection first (bypasses DNS SRV issues), then fallback to SRV
  const connectionOptions = [
    { 
      uri: process.env.MONGODB_URI, 
      name: 'Direct hostnames (bypass DNS SRV)',
      options: {
        serverSelectionTimeoutMS: 3000, // Reduced to 3 seconds
        socketTimeoutMS: 5000,
        connectTimeoutMS: 3000
      }
    },
    { 
      uri: process.env.MONGODB_URI_SRV, 
      name: 'SRV record (standard)',
      options: {
        serverSelectionTimeoutMS: 3000, // Reduced to 3 seconds
        socketTimeoutMS: 5000,
        connectTimeoutMS: 3000
      }
    }
  ];

  for (const { uri, name, options } of connectionOptions) {
    if (!uri) continue;
    
    try {
      console.log(`🔄 Trying ${name}...`);
      
      const conn = await mongoose.connect(uri, options);
      
      console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
      console.log(`📁 Database Name: ${conn.connection.name}`);
      console.log(`✅ Connection method: ${name}`);
      return; // Success, exit function
      
    } catch (error) {
      console.log(`❌ ${name} failed: ${error.message}`);
    }
  }
  
  // All connections failed - don't block server startup
  console.log('⚠️ MongoDB connection failed - continuing without database');
  console.log('💡 App will work with local data only');
};

// Food Analysis Schema
const foodAnalysisSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  nutritionData: {
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    veggies: { type: Number, required: true },
    healthScore: { type: Number, required: true }
  },
  analysisMethod: {
    type: String,
    default: 'ML Analysis'
  },
  mlModelUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Disable buffering to prevent hanging queries when disconnected
foodAnalysisSchema.set('bufferCommands', false);


const FoodAnalysis = mongoose.model('FoodAnalysis', foodAnalysisSchema);

// Database connection utilities
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

const safeDbOperation = async (operation, fallbackResult) => {
  if (!isDatabaseConnected()) {
    return fallbackResult;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error.message);
    return fallbackResult;
  }
};

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'food-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Routes

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Nutrivision Backend API',
    version: '1.0.0',
    workflow: {
      step1: 'POST /api/nutrition/analyze - Upload food image',
      step2: 'POST /api/nutrition/predict - AI Model classification', 
      step3: 'Returns food label (e.g. nasi_goreng)',
      step4: 'GET /api/nutrition/lookup/:foodLabel - Database query',
      step5: 'Returns nutrition data (Calories, Protein, etc)',
      step6: 'Complete JSON response with nutrition info'
    },
    endpoints: {
      analyze: '/api/nutrition/analyze - Complete workflow',
      predict: '/api/nutrition/predict - AI classification only',
      lookup: '/api/nutrition/lookup/:foodLabel - Database lookup',
      foods: '/api/nutrition/foods - Available foods list',
      health: '/api/health - Server status'
    },
    documentation: 'Follow the 6-step workflow as per diagram'
  });
});

// Use nutrition routes (implements the 6-step workflow)
app.use('/api/nutrition', nutritionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Nutrivision Backend is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    mlService: 'Active'
  });
});

// ML Model info endpoint
app.get('/api/model-info', (req, res) => {
  res.json({
    status: 'success',
    modelInfo: {
      type: 'MongoDB Atlas Nutrition Database + AI Visual Analysis',
      description: 'Advanced food recognition using comprehensive nutrition database with intelligent image analysis',
      features: [
        'MongoDB Atlas nutrition database lookup',
        'Color-based food type detection',
        'Size-based portion estimation', 
        'Smart fallback predictions',
        'Real-time image processing',
        'Comprehensive Indonesian food database'
      ],
      capabilities: {
        vegetables: 'Green color analysis with nutrition database',
        proteins: 'Red/brown color detection with protein database',
        carbohydrates: 'Beige/brown tone recognition with grain database',
        portions: 'Image size correlation with serving estimation',
        traditional: 'Indonesian traditional food recognition'
      },
      database: {
        connected: mongoose.connection.readyState === 1,
        collections: ['foodnutritions'],
        features: ['Visual matching', 'Keyword search', 'Nutrition calculation']
      }
    }
  });
});


// Get all food analyses

app.get('/api/food-analyses', async (req, res) => {
  const result = await safeDbOperation(
    // Database operation
    async () => {
      const analyses = await FoodAnalysis.find()
        .sort({ createdAt: -1 })
        .limit(20);
      
      return {
        status: 'success',
        data: analyses,
        count: analyses.length,
        source: 'database'
      };
    },
    // Fallback when database not available
    {
      status: 'info',
      message: 'Database not connected - no saved analyses available',
      data: [],
      count: 0,
      source: 'none',
      note: 'Analyses are processed in real-time. Connect to database for history.'
    }
  );
  
  res.json(result);
});

// Get specific food analysis by ID
app.get('/api/food-analyses/:id', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        status: 'info',
        message: 'Database not connected - analysis not available',
        note: 'Data is processed in real-time without permanent storage'
      });
    }

    const analysis = await FoodAnalysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({
        status: 'error',
        message: 'Food analysis not found'
      });
    }

    res.json({
      status: 'success',
      data: analysis
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.json({
      status: 'info',
      message: 'Analysis not found - database not available',
      note: 'App processes images in real-time'
    });
  }
});

// Delete food analysis
app.delete('/api/food-analyses/:id', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        status: 'info',
        message: 'Database not connected - no stored analyses to delete',
        note: 'Data is processed in real-time without permanent storage'
      });
    }

    const analysis = await FoodAnalysis.findByIdAndDelete(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({
        status: 'error',
        message: 'Food analysis not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Food analysis deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.json({
      status: 'info',
      message: 'Nothing to delete - database not available',
      note: 'App works without persistent storage'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  // Start MongoDB connection asynchronously (don't wait for it)
  connectDB().catch(err => {
    console.log('🔄 MongoDB connection running in background...');
  });
  
  // Start server immediately
  app.listen(PORT, () => {
    console.log(`🚀 Nutrivision Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🍕 New nutrition API: http://localhost:${PORT}/api/nutrition/analyze`);
    console.log(`🤖 ML Model info: http://localhost:${PORT}/api/model-info`);
    console.log(`✅ Server ready with 6-step workflow!`);
  });
};

startServer().catch(console.error);

module.exports = app;