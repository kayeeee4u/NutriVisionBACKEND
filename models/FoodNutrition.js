const mongoose = require('mongoose');

// Schema untuk database nutrisi makanan
const foodNutritionSchema = new mongoose.Schema({
  // Identifikasi makanan
  foodId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    indonesian: { type: String, required: true },
    english: { type: String, required: true }
  },
  aliases: [String], // Nama alternatif untuk makanan yang sama
  
  // Kategori makanan
  category: {
    type: String,
    required: true,
    enum: ['grain', 'protein', 'vegetable', 'fruit', 'dairy', 'snack', 'beverage', 'traditional', 'seafood']
  },
  subCategory: String,
  
  // Data nutrisi per 100 gram
  nutrition: {
    carbohydrates: { type: Number, required: true }, // gram
    protein: { type: Number, required: true },       // gram
    fat: { type: Number, required: true },           // gram
    fiber: { type: Number, default: 0 },             // gram
    calories: { type: Number, required: true },      // kcal
    sodium: { type: Number, default: 0 },            // mg
    sugar: { type: Number, default: 0 },             // gram
    calcium: { type: Number, default: 0 },           // mg
    iron: { type: Number, default: 0 },              // mg
    vitaminC: { type: Number, default: 0 }           // mg
  },
  
  // Karakteristik visual untuk AI recognition
  visualCharacteristics: {
    dominantColors: [String], // ['brown', 'white', 'green']
    texture: String,          // 'smooth', 'rough', 'mixed'
    shape: String,           // 'round', 'rectangular', 'irregular'
    size: String,            // 'small', 'medium', 'large'
    colorProfile: {
      avgRed: Number,
      avgGreen: Number,  
      avgBlue: Number,
      brightness: Number,
      colorVariance: Number
    }
  },
  
  // Keywords untuk matching
  searchKeywords: [String],
  
  // Informasi tambahan
  servingSize: {
    typical: { type: Number, default: 100 }, // gram
    unit: { type: String, default: 'gram' }
  },
  
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  },
  
  // Metadata
  source: String, // Sumber data nutrisi
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index untuk pencarian yang efisien
foodNutritionSchema.index({ 'name.indonesian': 'text', 'name.english': 'text', searchKeywords: 'text' });
foodNutritionSchema.index({ category: 1, subCategory: 1 });
foodNutritionSchema.index({ 'visualCharacteristics.dominantColors': 1 });

// Middleware untuk update timestamp
foodNutritionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method untuk mencari makanan berdasarkan karakteristik visual
foodNutritionSchema.statics.findByVisualCharacteristics = function(characteristics) {
  const { avgRed, avgGreen, avgBlue, brightness, colorVariance } = characteristics;
  
  // Tentukan dominant color berdasarkan RGB values
  let dominantColor = 'mixed';
  if (avgGreen > avgRed && avgGreen > avgBlue && avgGreen > 120) {
    dominantColor = 'green';
  } else if (avgRed > 160 && avgGreen > 130 && avgBlue < 120) {
    dominantColor = 'brown';
  } else if (brightness > 180) {
    dominantColor = 'white';
  } else if (brightness < 100) {
    dominantColor = 'dark';
  }
  
  // Cari makanan dengan karakteristik visual yang cocok
  return this.find({
    'visualCharacteristics.dominantColors': dominantColor
  }).limit(10);
};

// Method untuk pencarian berdasarkan keywords
foodNutritionSchema.statics.searchByKeywords = function(keywords) {
  return this.find({
    $text: { $search: keywords }
  }, {
    score: { $meta: 'textScore' }
  }).sort({
    score: { $meta: 'textScore' }
  });
};

// Method untuk get random food dari kategori
foodNutritionSchema.statics.getRandomFromCategory = function(category) {
  return this.aggregate([
    { $match: { category: category } },
    { $sample: { size: 1 } }
  ]);
};

const FoodNutrition = mongoose.model('FoodNutrition', foodNutritionSchema);

module.exports = FoodNutrition;