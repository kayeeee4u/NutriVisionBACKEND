// Nutrition Database - Comprehensive food nutrition data
// Data berdasarkan per 100gram serving

const nutritionDatabase = {
  // === NASI & KARBOHIDRAT ===
  'nasi_putih': { carbs: 28, protein: 2.7, fat: 0.3, fiber: 0.4, calories: 130, category: 'grain' },
  'nasi_merah': { carbs: 25, protein: 2.6, fat: 0.9, fiber: 1.4, calories: 111, category: 'grain' },
  'nasi_goreng': { carbs: 35, protein: 4.2, fat: 3.3, fiber: 0.6, calories: 163, category: 'grain' },
  'lontong': { carbs: 22, protein: 2.0, fat: 0.2, fiber: 1.0, calories: 98, category: 'grain' },
  'ketupat': { carbs: 21, protein: 1.8, fat: 0.1, fiber: 0.8, calories: 95, category: 'grain' },
  'bubur_ayam': { carbs: 16, protein: 3.5, fat: 1.2, fiber: 0.3, calories: 78, category: 'grain' },
  
  // Roti & Pasta
  'roti_tawar': { carbs: 49, protein: 9.0, fat: 3.2, fiber: 2.7, calories: 265, category: 'grain' },
  'roti_gandum': { carbs: 41, protein: 12.9, fat: 4.2, fiber: 7.0, calories: 247, category: 'grain' },
  'mie_ayam': { carbs: 25, protein: 5.5, fat: 0.9, fiber: 1.2, calories: 138, category: 'grain' },
  'bakmi': { carbs: 25, protein: 4.5, fat: 1.1, fiber: 1.8, calories: 131, category: 'noodle' },
  
  // === PROTEIN HEWANI ===
  'ayam_goreng': { carbs: 0, protein: 31.0, fat: 15.3, fiber: 0, calories: 250, category: 'poultry' },
  'ayam_bakar': { carbs: 0, protein: 27.3, fat: 7.4, fiber: 0, calories: 165, category: 'poultry' },
  'rendang': { carbs: 5.2, protein: 22.6, fat: 19.0, fiber: 0.8, calories: 193, category: 'beef' },
  'sate_ayam': { carbs: 2.1, protein: 25.2, fat: 14.1, fiber: 0.2, calories: 210, category: 'poultry' },
  'ikan_bakar': { carbs: 0, protein: 28.5, fat: 6.2, fiber: 0, calories: 162, category: 'fish' },
  'ikan_goreng': { carbs: 3.2, protein: 20.1, fat: 13.7, fiber: 0, calories: 205, category: 'fish' },
  'telur_dadar': { carbs: 0.7, protein: 13.6, fat: 11.2, fiber: 0, calories: 154, category: 'egg' },
  'telur_rebus': { carbs: 1.1, protein: 12.6, fat: 10.6, fiber: 0, calories: 155, category: 'egg' },
  
  // Seafood
  'udang_goreng': { carbs: 0.2, protein: 24.0, fat: 1.7, fiber: 0, calories: 106, category: 'seafood' },
  'cumi_goreng': { carbs: 3.1, protein: 15.6, fat: 1.4, fiber: 0, calories: 79, category: 'seafood' },
  
  // === SAYURAN ===
  'gado_gado': { carbs: 12.5, protein: 4.8, fat: 8.9, fiber: 3.2, calories: 136, category: 'salad' },
  'sayur_asem': { carbs: 8.3, protein: 2.1, fat: 0.4, fiber: 2.8, calories: 45, category: 'soup' },
  'cap_cay': { carbs: 7.8, protein: 3.2, fat: 2.1, fiber: 2.5, calories: 58, category: 'vegetable' },
  'tumis_kangkung': { carbs: 5.9, protein: 2.9, fat: 0.3, fiber: 2.6, calories: 36, category: 'vegetable' },
  'capcay': { carbs: 6.2, protein: 2.8, fat: 1.8, fiber: 2.3, calories: 48, category: 'vegetable' },
  'lalap': { carbs: 4.1, protein: 1.8, fat: 0.2, fiber: 2.0, calories: 25, category: 'vegetable' },
  
  // === BUAH-BUAHAN ===
  'pisang': { carbs: 23, protein: 1.1, fat: 0.3, fiber: 2.6, calories: 89, category: 'fruit' },
  'apel': { carbs: 14, protein: 0.3, fat: 0.2, fiber: 2.4, calories: 52, category: 'fruit' },
  'jeruk': { carbs: 12, protein: 0.9, fat: 0.1, fiber: 2.4, calories: 47, category: 'fruit' },
  'mangga': { carbs: 15, protein: 0.8, fat: 0.4, fiber: 1.6, calories: 60, category: 'fruit' },
  'pepaya': { carbs: 11, protein: 0.5, fat: 0.3, fiber: 1.7, calories: 43, category: 'fruit' },
  'semangka': { carbs: 8, protein: 0.6, fat: 0.2, fiber: 0.4, calories: 30, category: 'fruit' },
  
  // === MAKANAN TRADISIONAL ===
  'gudeg': { carbs: 20.5, protein: 2.8, fat: 4.2, fiber: 2.1, calories: 127, category: 'traditional' },
  'soto_ayam': { carbs: 8.2, protein: 12.5, fat: 3.1, fiber: 0.8, calories: 108, category: 'soup' },
  'rawon': { carbs: 6.8, protein: 15.2, fat: 5.5, fiber: 1.2, calories: 135, category: 'soup' },
  'pecel': { carbs: 11.8, protein: 5.2, fat: 12.1, fiber: 4.5, calories: 168, category: 'salad' },
  'rujak': { carbs: 15.2, protein: 1.1, fat: 0.3, fiber: 3.8, calories: 67, category: 'fruit' },
  
  // === GORENGAN & SNACKS ===
  'tempe_goreng': { carbs: 9.4, protein: 20.8, fat: 8.8, fiber: 9.0, calories: 193, category: 'soy' },
  'tahu_goreng': { carbs: 1.9, protein: 17.3, fat: 8.1, fiber: 0.4, calories: 144, category: 'soy' },
  'bakwan': { carbs: 20.3, protein: 4.2, fat: 8.7, fiber: 1.5, calories: 167, category: 'fried' },
  'gorengan': { carbs: 25.1, protein: 3.8, fat: 12.5, fiber: 1.8, calories: 215, category: 'fried' },
  
  // === MINUMAN ===
  'es_teh': { carbs: 35, protein: 0, fat: 0, fiber: 0, calories: 140, category: 'drink' },
  'jus_jeruk': { carbs: 112, protein: 1.7, fat: 0.5, fiber: 0.5, calories: 112, category: 'drink' },
  'air_kelapa': { carbs: 19, protein: 0.7, fat: 0.2, fiber: 1.1, calories: 19, category: 'drink' },
  
  // === DIM SUM & CHINESE FOOD ===
  'siomay': { carbs: 15.2, protein: 8.5, fat: 3.2, fiber: 0.8, calories: 125, category: 'dumpling' },
  'dimsum': { carbs: 18.3, protein: 12.1, fat: 4.5, fiber: 1.2, calories: 156, category: 'dumpling' },
  'pangsit': { carbs: 22.1, protein: 6.8, fat: 5.3, fiber: 0.9, calories: 158, category: 'dumpling' },
  'lumpia': { carbs: 28.5, protein: 5.2, fat: 8.7, fiber: 2.1, calories: 198, category: 'roll' }
};

// Food recognition patterns - untuk matching gambar dengan database
const foodPatterns = {
  // Pola warna dan karakteristik visual
  rice_patterns: {
    white_rice: { colors: ['white', 'light_beige'], keywords: ['nasi_putih', 'rice'] },
    fried_rice: { colors: ['brown', 'mixed'], keywords: ['nasi_goreng', 'fried_rice'] },
    yellow_rice: { colors: ['yellow', 'golden'], keywords: ['nasi_kuning', 'turmeric_rice'] }
  },
  
  protein_patterns: {
    chicken: { colors: ['brown', 'golden', 'white'], keywords: ['ayam', 'chicken'] },
    fish: { colors: ['white', 'silver', 'brown'], keywords: ['ikan', 'fish'] },
    beef: { colors: ['dark_brown', 'red'], keywords: ['daging', 'beef', 'rendang'] },
    egg: { colors: ['yellow', 'white'], keywords: ['telur', 'egg'] }
  },
  
  vegetable_patterns: {
    green_veggies: { colors: ['green', 'dark_green'], keywords: ['sayur', 'vegetable', 'kangkung'] },
    mixed_veggies: { colors: ['mixed', 'colorful'], keywords: ['gado_gado', 'cap_cay', 'salad'] },
    soup: { colors: ['clear', 'brown_broth'], keywords: ['soto', 'sup', 'soup'] }
  },
  
  traditional_patterns: {
    gudeg: { colors: ['brown', 'dark_brown'], keywords: ['gudeg', 'jackfruit'] },
    rendang: { colors: ['very_dark_brown'], keywords: ['rendang', 'dark_curry'] },
    soto: { colors: ['yellow_broth', 'clear'], keywords: ['soto', 'broth'] }
  }
};

// Function untuk mencari makanan berdasarkan karakteristik visual
function findBestFoodMatch(imageCharacteristics) {
  const { avgRed, avgGreen, avgBlue, brightness, colorVariance } = imageCharacteristics;
  
  let candidates = [];
  
  // Analisis berdasarkan warna dominan
  if (avgGreen > avgRed && avgGreen > avgBlue && avgGreen > 120) {
    // Hijau dominan - kemungkinan sayuran
    candidates = ['tumis_kangkung', 'cap_cay', 'lalap', 'gado_gado', 'sayur_asem'];
  } else if (avgRed > 160 && avgGreen > 130 && avgBlue < 120) {
    // Coklat/beige - kemungkinan protein atau nasi goreng  
    candidates = ['ayam_goreng', 'nasi_goreng', 'rendang', 'ayam_bakar'];
  } else if (brightness > 180 && colorVariance < 50) {
    // Putih/terang - kemungkinan nasi putih atau telur
    candidates = ['nasi_putih', 'lontong', 'telur_dadar', 'tahu_goreng'];
  } else if (brightness < 100) {
    // Gelap - kemungkinan rendang, rawon, atau protein gelap
    candidates = ['rendang', 'rawon', 'ayam_bakar', 'ikan_bakar'];
  } else if (colorVariance > 80) {
    // Warna beragam - kemungkinan makanan kompleks
    candidates = ['gado_gado', 'cap_cay', 'nasi_goreng', 'soto_ayam', 'dimsum'];
  } else {
    // Default untuk makanan umum
    candidates = ['nasi_putih', 'ayam_goreng', 'sayur_asem', 'tempe_goreng', 'ikan_goreng'];
  }
  
  // Random selection dari candidates untuk variasi
  const selectedFood = candidates[Math.floor(Math.random() * candidates.length)];
  return selectedFood;
}

// Function untuk get nutrition data
function getNutritionData(foodKey) {
  return nutritionDatabase[foodKey] || nutritionDatabase['nasi_putih']; // Default fallback
}

// Function untuk calculate serving size (estimasi dari ukuran gambar)
function calculateServingSize(imageSize, baseServing = 150) { // 150g default serving
  const sizeFactor = Math.min(2.0, Math.max(0.5, imageSize / (500 * 1024))); // 500KB baseline
  return Math.round(baseServing * sizeFactor);
}

module.exports = {
  nutritionDatabase,
  foodPatterns,
  findBestFoodMatch,
  getNutritionData,
  calculateServingSize
};