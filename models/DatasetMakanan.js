const mongoose = require('mongoose');

// Schema untuk collection "datasetmakanan" yang sudah ada dari data scientist
const datasetMakananSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  food_category: { type: String, required: true },
  calories: { type: Number, required: true },
  protein_g: { type: Number, required: true },
  carbs_g: { type: Number, required: true },
  fat_g: { type: Number, required: true },
  fiber_g: { type: Number, default: 0 },
  sugar_g: { type: Number, default: 0 },
  sodium_mg: { type: Number, default: 0 },
  calcium_mg: { type: Number, default: 0 },
  iron_mg: { type: Number, default: 0 },
  vitamin_c_mg: { type: Number, default: 0 },
  cholesterol_mg: { type: Number, default: 0 },
  saturated_fat_g: { type: Number, default: 0 },
  source: String,
  vitamin_c_estimated: { type: Boolean, default: false },
  health_score: { type: Number, default: 70 },
  risk_diabetes: { type: Number, default: 0 },
  risk_hypertension: { type: Number, default: 0 },
  risk_obesity: { type: Number, default: 0 },
  risk_count: { type: Number, default: 0 },
  risk_level: { type: String, default: 'low' },
  nutrition_label: String
}, {
  collection: 'datasetmakanan' // Explicitly specify collection name
});

// Index untuk pencarian yang efisien
datasetMakananSchema.index({ food_name: 'text', food_category: 'text' });
datasetMakananSchema.index({ food_category: 1 });

// Method untuk konversi ke format API yang diharapkan
datasetMakananSchema.methods.toAPIFormat = function() {
  return {
    foodId: this.generateFoodId(),
    name: {
      indonesian: this.food_name,
      english: this.food_name // Same as Indonesian for now
    },
    category: this.mapCategory(),
    subCategory: this.food_category,
    nutrition: {
      carbohydrates: this.carbs_g,
      protein: this.protein_g,
      fat: this.fat_g,
      fiber: this.fiber_g,
      calories: this.calories,
      sodium: this.sodium_mg,
      sugar: this.sugar_g,
      calcium: this.calcium_mg,
      iron: this.iron_mg,
      vitaminC: this.vitamin_c_mg
    },
    healthScore: this.health_score || 70,
    riskFactors: {
      diabetes: this.risk_diabetes,
      hypertension: this.risk_hypertension,
      obesity: this.risk_obesity,
      level: this.risk_level
    },
    source: this.source || 'Dataset Makanan Indonesia',
    verified: true
  };
};

// Generate foodId dari nama makanan
datasetMakananSchema.methods.generateFoodId = function() {
  return this.food_name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '_')        // Replace spaces with underscore
    .substring(0, 30);           // Limit length
};

// Map kategori ke format yang konsisten
datasetMakananSchema.methods.mapCategory = function() {
  const categoryMap = {
    'protein': 'protein',
    'vegetables': 'vegetable', 
    'fruits': 'fruit',
    'grains': 'grain',
    'dairy': 'dairy',
    'snacks': 'snack',
    'beverages': 'beverage',
    'traditional': 'traditional',
    'seafood': 'seafood'
  };
  
  const normalized = this.food_category?.toLowerCase() || 'mixed';
  return categoryMap[normalized] || 'mixed';
};

// Static method untuk pencarian berdasarkan nama
datasetMakananSchema.statics.searchByName = function(searchTerm) {
  return this.find({
    $text: { $search: searchTerm }
  }).limit(10);
};

// Static method untuk pencarian berdasarkan kategori
datasetMakananSchema.statics.findByCategory = function(category) {
  return this.find({
    food_category: new RegExp(category, 'i')
  }).limit(10);
};

// Static method untuk mendapatkan makanan random
datasetMakananSchema.statics.getRandomFood = function(count = 1) {
  return this.aggregate([
    { $sample: { size: count } }
  ]);
};

// Static method untuk pencarian fuzzy berdasarkan nama makanan
datasetMakananSchema.statics.fuzzySearch = function(query) {
  // Split query into words untuk pencarian yang lebih fleksibel
  const words = query.toLowerCase().split(/\s+/);
  
  // Create regex pattern untuk each word
  const regexPatterns = words.map(word => new RegExp(word, 'i'));
  
  return this.find({
    $or: [
      // Exact match
      { food_name: new RegExp(query, 'i') },
      // Any word matches
      { food_name: { $in: regexPatterns } }
    ]
  }).limit(5);
};

const DatasetMakanan = mongoose.model('DatasetMakanan', datasetMakananSchema);

module.exports = DatasetMakanan;