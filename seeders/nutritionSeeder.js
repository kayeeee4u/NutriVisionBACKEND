const mongoose = require('mongoose');
const FoodNutrition = require('../models/FoodNutrition');
require('dotenv').config();

// Sample nutrition data untuk MongoDB localhost
const nutritionData = [
  {
    foodId: 'nasi_putih',
    name: {
      indonesian: 'Nasi Putih',
      english: 'White Rice'
    },
    aliases: ['nasi', 'beras', 'rice'],
    category: 'grain',
    subCategory: 'staple',
    nutrition: {
      carbohydrates: 28.17,
      protein: 2.69,
      fat: 0.28,
      fiber: 0.4,
      calories: 130,
      sodium: 1,
      sugar: 0.05,
      calcium: 10,
      iron: 0.8,
      vitaminC: 0
    },
    visualCharacteristics: {
      dominantColors: ['white', 'beige'],
      texture: 'smooth',
      shape: 'irregular',
      size: 'medium',
      colorProfile: {
        avgRed: 245,
        avgGreen: 245,
        avgBlue: 220,
        brightness: 237,
        colorVariance: 15
      }
    },
    searchKeywords: ['nasi', 'putih', 'beras', 'rice', 'staple'],
    servingSize: {
      typical: 150,
      unit: 'gram'
    },
    healthScore: 65,
    source: 'USDA FoodData Central',
    verified: true
  },
  {
    foodId: 'ayam_goreng',
    name: {
      indonesian: 'Ayam Goreng',
      english: 'Fried Chicken'
    },
    aliases: ['ayam', 'chicken', 'protein'],
    category: 'protein',
    subCategory: 'meat',
    nutrition: {
      carbohydrates: 0.87,
      protein: 31.02,
      fat: 15.06,
      fiber: 0,
      calories: 250,
      sodium: 540,
      sugar: 0.21,
      calcium: 15,
      iron: 1.05,
      vitaminC: 0
    },
    visualCharacteristics: {
      dominantColors: ['brown', 'golden'],
      texture: 'crispy',
      shape: 'irregular',
      size: 'large',
      colorProfile: {
        avgRed: 180,
        avgGreen: 140,
        avgBlue: 90,
        brightness: 137,
        colorVariance: 45
      }
    },
    searchKeywords: ['ayam', 'goreng', 'chicken', 'fried', 'protein'],
    servingSize: {
      typical: 100,
      unit: 'gram'
    },
    healthScore: 45,
    source: 'Indonesian Food Database',
    verified: true
  },
  {
    foodId: 'gado_gado',
    name: {
      indonesian: 'Gado-Gado',
      english: 'Indonesian Vegetable Salad'
    },
    aliases: ['gado', 'salad', 'sayur'],
    category: 'vegetable',
    subCategory: 'traditional',
    nutrition: {
      carbohydrates: 13.2,
      protein: 8.5,
      fat: 12.8,
      fiber: 5.2,
      calories: 180,
      sodium: 420,
      sugar: 6.8,
      calcium: 85,
      iron: 2.3,
      vitaminC: 45
    },
    visualCharacteristics: {
      dominantColors: ['green', 'brown', 'mixed'],
      texture: 'mixed',
      shape: 'irregular',
      size: 'large',
      colorProfile: {
        avgRed: 120,
        avgGreen: 150,
        avgBlue: 80,
        brightness: 117,
        colorVariance: 60
      }
    },
    searchKeywords: ['gado', 'sayur', 'salad', 'vegetables', 'traditional'],
    servingSize: {
      typical: 200,
      unit: 'gram'
    },
    healthScore: 85,
    source: 'Indonesian Traditional Food Database',
    verified: true
  },
  {
    foodId: 'nasi_goreng',
    name: {
      indonesian: 'Nasi Goreng',
      english: 'Indonesian Fried Rice'
    },
    aliases: ['nasgor', 'fried rice', 'nasi'],
    category: 'grain',
    subCategory: 'traditional',
    nutrition: {
      carbohydrates: 42.5,
      protein: 8.2,
      fat: 7.8,
      fiber: 1.2,
      calories: 260,
      sodium: 680,
      sugar: 2.1,
      calcium: 25,
      iron: 1.8,
      vitaminC: 12
    },
    visualCharacteristics: {
      dominantColors: ['brown', 'orange', 'mixed'],
      texture: 'mixed',
      shape: 'irregular',
      size: 'medium',
      colorProfile: {
        avgRed: 165,
        avgGreen: 135,
        avgBlue: 95,
        brightness: 132,
        colorVariance: 35
      }
    },
    searchKeywords: ['nasi', 'goreng', 'fried', 'rice', 'traditional', 'indonesian'],
    servingSize: {
      typical: 200,
      unit: 'gram'
    },
    healthScore: 60,
    source: 'Indonesian Traditional Food Database',
    verified: true
  },
  {
    foodId: 'tempe_goreng',
    name: {
      indonesian: 'Tempe Goreng',
      english: 'Fried Tempeh'
    },
    aliases: ['tempe', 'tempeh', 'protein nabati'],
    category: 'protein',
    subCategory: 'plant_based',
    nutrition: {
      carbohydrates: 9.39,
      protein: 20.29,
      fat: 11.38,
      fiber: 9.0,
      calories: 190,
      sodium: 9,
      sugar: 2.54,
      calcium: 111,
      iron: 2.7,
      vitaminC: 0
    },
    visualCharacteristics: {
      dominantColors: ['brown', 'golden'],
      texture: 'textured',
      shape: 'rectangular',
      size: 'medium',
      colorProfile: {
        avgRed: 150,
        avgGreen: 120,
        avgBlue: 80,
        brightness: 117,
        colorVariance: 35
      }
    },
    searchKeywords: ['tempe', 'tempeh', 'protein', 'nabati', 'fermented'],
    servingSize: {
      typical: 100,
      unit: 'gram'
    },
    healthScore: 80,
    source: 'Indonesian Food Database',
    verified: true
  },
  {
    foodId: 'sayur_bayam',
    name: {
      indonesian: 'Sayur Bayam',
      english: 'Spinach Vegetables'
    },
    aliases: ['bayam', 'spinach', 'sayur hijau'],
    category: 'vegetable',
    subCategory: 'leafy_green',
    nutrition: {
      carbohydrates: 3.63,
      protein: 2.86,
      fat: 0.39,
      fiber: 2.2,
      calories: 23,
      sodium: 79,
      sugar: 0.42,
      calcium: 99,
      iron: 2.71,
      vitaminC: 28.1
    },
    visualCharacteristics: {
      dominantColors: ['green', 'dark_green'],
      texture: 'soft',
      shape: 'irregular',
      size: 'medium',
      colorProfile: {
        avgRed: 60,
        avgGreen: 120,
        avgBlue: 40,
        brightness: 73,
        colorVariance: 40
      }
    },
    searchKeywords: ['bayam', 'spinach', 'sayur', 'hijau', 'vegetables'],
    servingSize: {
      typical: 100,
      unit: 'gram'
    },
    healthScore: 95,
    source: 'USDA FoodData Central',
    verified: true
  },
  {
    foodId: 'ikan_bakar',
    name: {
      indonesian: 'Ikan Bakar',
      english: 'Grilled Fish'
    },
    aliases: ['ikan', 'fish', 'bakar', 'grilled'],
    category: 'seafood',
    subCategory: 'fish',
    nutrition: {
      carbohydrates: 0,
      protein: 22.78,
      fat: 4.05,
      fiber: 0,
      calories: 124,
      sodium: 54,
      sugar: 0,
      calcium: 16,
      iron: 0.29,
      vitaminC: 0
    },
    visualCharacteristics: {
      dominantColors: ['brown', 'white', 'charred'],
      texture: 'flaky',
      shape: 'irregular',
      size: 'large',
      colorProfile: {
        avgRed: 140,
        avgGreen: 120,
        avgBlue: 100,
        brightness: 120,
        colorVariance: 25
      }
    },
    searchKeywords: ['ikan', 'bakar', 'fish', 'grilled', 'seafood'],
    servingSize: {
      typical: 150,
      unit: 'gram'
    },
    healthScore: 85,
    source: 'Indonesian Seafood Database',
    verified: true
  },
  {
    foodId: 'pisang_goreng',
    name: {
      indonesian: 'Pisang Goreng',
      english: 'Fried Banana'
    },
    aliases: ['pisang', 'banana', 'gorengan'],
    category: 'snack',
    subCategory: 'fried_snack',
    nutrition: {
      carbohydrates: 35.2,
      protein: 2.1,
      fat: 8.5,
      fiber: 2.8,
      calories: 200,
      sodium: 125,
      sugar: 18.5,
      calcium: 15,
      iron: 0.8,
      vitaminC: 8.7
    },
    visualCharacteristics: {
      dominantColors: ['golden', 'brown', 'yellow'],
      texture: 'crispy',
      shape: 'elongated',
      size: 'medium',
      colorProfile: {
        avgRed: 200,
        avgGreen: 165,
        avgBlue: 100,
        brightness: 155,
        colorVariance: 50
      }
    },
    searchKeywords: ['pisang', 'goreng', 'banana', 'fried', 'snack'],
    servingSize: {
      typical: 80,
      unit: 'gram'
    },
    healthScore: 40,
    source: 'Indonesian Snack Database',
    verified: true
  }
];

// Fungsi untuk koneksi ke database
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB localhost');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// Fungsi untuk seed database
async function seedNutritionData() {
  try {
    console.log('🌱 Starting nutrition data seeding...');
    
    // Clear existing data
    await FoodNutrition.deleteMany({});
    console.log('🗑️ Cleared existing nutrition data');
    
    // Insert new data
    const result = await FoodNutrition.insertMany(nutritionData);
    console.log(`✅ Successfully seeded ${result.length} nutrition records`);
    
    // Verify data
    const count = await FoodNutrition.countDocuments();
    console.log(`📊 Total nutrition records in database: ${count}`);
    
    // Show sample data
    const samples = await FoodNutrition.find({}).limit(3);
    console.log('📋 Sample records:');
    samples.forEach(item => {
      console.log(`  - ${item.name.indonesian} (${item.foodId})`);
    });
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
}

// Main function
async function main() {
  try {
    await connectToDatabase();
    await seedNutritionData();
    console.log('🎉 Nutrition database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding process failed:', error.message);
    process.exit(1);
  }
}

// Run seeder jika dipanggil langsung
if (require.main === module) {
  main();
}

module.exports = {
  seedNutritionData,
  nutritionData
};