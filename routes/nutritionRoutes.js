const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mlService = require('../services/mlServiceNew');
const nutritionService = require('../services/nutritionService');

// Multer configuration for image upload
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Step 1: Kirim file gambar makanan (POST /api/nutrition/analyze)
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file uploaded'
      });
    }

    console.log('📸 Step 1: Received image for analysis:', req.file.filename);

    // Step 2: Teruskan gambar untuk klasifikasi (POST /predict)
    console.log('🔍 Step 2: Sending image to AI Model for classification...');
    const classificationResult = await mlService.classifyFood(req.file.path);
    
    if (!classificationResult.success) {
      throw new Error('Food classification failed');
    }

    // Step 3: Kembalikan label makanan (Contoh: 'nasi_goreng')
    const foodLabel = classificationResult.foodLabel;
    console.log(`🏷️ Step 3: Food classified as: ${foodLabel}`);

    // Step 4: Query nutrisi untuk makanan yang terdeteksi
    console.log(`🔍 Step 4: Querying nutrition data for: ${foodLabel}`);
    const nutritionData = await nutritionService.getNutritionByLabel(foodLabel);
    
    if (!nutritionData) {
      throw new Error(`Nutrition data not found for: ${foodLabel}`);
    }

    // Step 5: Calculate serving-based nutrition
    const servingSize = nutritionService.estimateServingSize(
      req.file.size || 150000 // Default 150KB if size unknown
    );
    
    const finalNutrition = nutritionService.calculateNutritionForServing(
      nutritionData, 
      servingSize
    );

    console.log(`📊 Step 5: Calculated nutrition for ${servingSize}g serving`);

    // Step 6: Kirim JSON Response Nutrisi Lengkap
    const response = {
      status: 'success',
      message: 'Food analysis completed successfully',
      data: {
        // Classification results
        foodLabel: foodLabel,
        foodName: nutritionData.name?.indonesian || nutritionData.name || 'Unknown',
        confidence: classificationResult.confidence || 0.85,
        
        // Nutrition data (Flat structure for UI)
        carbs: nutritionData.nutrition?.carbohydrates || 0,
        protein: nutritionData.nutrition?.protein || 0,
        veggies: nutritionData.nutrition?.fiber ? nutritionData.nutrition.fiber * 3 : 0,
        calories: nutritionData.nutrition?.calories || 0,
        fat: nutritionData.nutrition?.fat || 0,
        fiber: nutritionData.nutrition?.fiber || 0,
        
        healthScore: nutritionData.healthScore || 50,
        
        // ML Alternatives — normalise field names (label → foodName)
        alternatives: (classificationResult.alternatives || []).map(a => ({
          foodName: a.label || a.foodName || 'Unknown',
          confidence: a.confidence
        })),
        
        // Meta information
        servingSize: servingSize,
        imageUrl: `/uploads/${req.file.filename}`,
        analysisMethod: 'AI Model + Database Lookup',
        timestamp: new Date().toISOString()
      }
    };

    console.log('✅ Step 6: Sending complete nutrition response');
    res.json(response);

  } catch (error) {
    console.error('❌ Analysis workflow failed:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to analyze food image',
      error: error.message,
      workflow_step: 'Error in processing pipeline'
    });
  }
});

// Dedicated endpoint untuk Step 2: AI Model Classification
router.post('/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file uploaded'
      });
    }

    console.log('🤖 AI Model: Classifying food image...');
    const result = await mlService.classifyFood(req.file.path);
    
    res.json({
      status: 'success',
      foodLabel: result.foodLabel,
      confidence: result.confidence,
      alternatives: result.alternatives || [],
      processingTime: result.processingTime
    });

  } catch (error) {
    console.error('❌ AI Model prediction failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to classify food image',
      error: error.message
    });
  }
});

// Step 4: Query nutrisi berdasarkan food label
router.get('/lookup/:foodLabel', async (req, res) => {
  try {
    const { foodLabel } = req.params;
    console.log(`🔍 Database lookup for: ${foodLabel}`);
    
    const nutritionData = await nutritionService.getNutritionByLabel(foodLabel);
    
    if (!nutritionData) {
      return res.status(404).json({
        status: 'error',
        message: `Nutrition data not found for: ${foodLabel}`
      });
    }

    res.json({
      status: 'success',
      foodLabel: foodLabel,
      data: nutritionData,
      source: 'MongoDB Atlas Database'
    });

  } catch (error) {
    console.error('❌ Database lookup failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to lookup nutrition data',
      error: error.message
    });
  }
});

// Get all available food labels
router.get('/foods', async (req, res) => {
  try {
    const foods = await nutritionService.getAllFoods();
    
    res.json({
      status: 'success',
      data: foods.map(food => ({
        foodId: food.foodId,
        name: food.name,
        category: food.category
      })),
      count: foods.length
    });

  } catch (error) {
    console.error('❌ Failed to get foods list:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get foods list',
      error: error.message
    });
  }
});

module.exports = router;