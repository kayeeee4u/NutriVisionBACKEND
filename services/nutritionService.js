const FoodNutrition = require('../models/FoodNutrition');
const mongoose = require('mongoose');

class NutritionService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    try {
      // Check if we have database connection first
      if (mongoose.connection.readyState !== 1) {
        console.log('🍽️ Database not connected, using static nutrition data');
        this.initialized = true; // Mark as initialized with static data
        return true;
      }

      // Check if we have data in database
      const count = await FoodNutrition.countDocuments().maxTimeMS(5000);
      
      if (count === 0) {
        console.log('🍽️ Database kosong, initializing dengan data dasar...');
        await this.seedDatabase();
      } else {
        console.log(`🍽️ Database nutrition ready dengan ${count} makanan`);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize nutrition service:', error.message);
      console.log('🔄 Using static nutrition data as fallback');
      this.initialized = true; // Still mark as initialized but with static data
      return true; // Return true so server can continue
    }
  }

  async seedDatabase() {
    const initialData = [
      {
        foodId: 'nasi_putih',
        name: { indonesian: 'Nasi Putih', english: 'White Rice' },
        aliases: ['nasi', 'rice', 'steamed rice'],
        category: 'grain',
        subCategory: 'rice',
        nutrition: {
          carbohydrates: 130,
          protein: 2.7,
          fat: 0.3,
          fiber: 0.4,
          calories: 130,
          sodium: 5
        },
        visualCharacteristics: {
          dominantColors: ['white', 'beige'],
          texture: 'smooth',
          shape: 'irregular',
          size: 'medium',
          colorProfile: {
            avgRed: 245,
            avgGreen: 245,
            avgBlue: 240,
            brightness: 243,
            colorVariance: 10
          }
        },
        searchKeywords: ['nasi', 'rice', 'putih', 'white', 'staple'],
        healthScore: 65
      },
      {
        foodId: 'ayam_goreng',
        name: { indonesian: 'Ayam Goreng', english: 'Fried Chicken' },
        aliases: ['chicken', 'ayam', 'fried chicken'],
        category: 'protein',
        subCategory: 'poultry',
        nutrition: {
          carbohydrates: 0,
          protein: 31.0,
          fat: 15.3,
          fiber: 0,
          calories: 250,
          sodium: 300
        },
        visualCharacteristics: {
          dominantColors: ['brown', 'golden'],
          texture: 'crispy',
          shape: 'irregular',
          size: 'medium',
          colorProfile: {
            avgRed: 180,
            avgGreen: 140,
            avgBlue: 90,
            brightness: 137,
            colorVariance: 45
          }
        },
        searchKeywords: ['ayam', 'chicken', 'goreng', 'fried', 'protein'],
        healthScore: 60
      },
      {
        foodId: 'gado_gado',
        name: { indonesian: 'Gado-Gado', english: 'Indonesian Salad' },
        aliases: ['salad', 'vegetable salad', 'mixed vegetables'],
        category: 'vegetable',
        subCategory: 'salad',
        nutrition: {
          carbohydrates: 12.5,
          protein: 4.8,
          fat: 8.9,
          fiber: 3.2,
          calories: 136,
          sodium: 200
        },
        visualCharacteristics: {
          dominantColors: ['green', 'mixed', 'colorful'],
          texture: 'mixed',
          shape: 'irregular',
          size: 'large',
          colorProfile: {
            avgRed: 120,
            avgGreen: 150,
            avgBlue: 80,
            brightness: 117,
            colorVariance: 70
          }
        },
        searchKeywords: ['gado', 'salad', 'sayur', 'vegetable', 'healthy'],
        healthScore: 85
      },
      {
        foodId: 'rendang',
        name: { indonesian: 'Rendang', english: 'Rendang Beef' },
        aliases: ['beef curry', 'spicy beef', 'daging'],
        category: 'protein',
        subCategory: 'beef',
        nutrition: {
          carbohydrates: 5.2,
          protein: 22.6,
          fat: 19.0,
          fiber: 0.8,
          calories: 193,
          sodium: 400
        },
        visualCharacteristics: {
          dominantColors: ['dark', 'brown', 'red'],
          texture: 'rough',
          shape: 'chunky',
          size: 'medium',
          colorProfile: {
            avgRed: 100,
            avgGreen: 70,
            avgBlue: 50,
            brightness: 73,
            colorVariance: 25
          }
        },
        searchKeywords: ['rendang', 'beef', 'curry', 'spicy', 'traditional'],
        healthScore: 70
      },
      {
        foodId: 'tempe_goreng',
        name: { indonesian: 'Tempe Goreng', english: 'Fried Tempeh' },
        aliases: ['tempeh', 'soy protein', 'fermented soy'],
        category: 'protein',
        subCategory: 'soy',
        nutrition: {
          carbohydrates: 9.4,
          protein: 20.8,
          fat: 8.8,
          fiber: 9.0,
          calories: 193,
          sodium: 150
        },
        visualCharacteristics: {
          dominantColors: ['brown', 'golden'],
          texture: 'firm',
          shape: 'rectangular',
          size: 'medium',
          colorProfile: {
            avgRed: 160,
            avgGreen: 130,
            avgBlue: 80,
            brightness: 123,
            colorVariance: 40
          }
        },
        searchKeywords: ['tempe', 'tempeh', 'soy', 'protein', 'vegetarian'],
        healthScore: 80
      },
      {
        foodId: 'soto_ayam',
        name: { indonesian: 'Soto Ayam', english: 'Chicken Soup' },
        aliases: ['chicken soup', 'sup ayam', 'broth'],
        category: 'protein',
        subCategory: 'soup',
        nutrition: {
          carbohydrates: 8.2,
          protein: 12.5,
          fat: 3.1,
          fiber: 0.8,
          calories: 108,
          sodium: 800
        },
        visualCharacteristics: {
          dominantColors: ['yellow', 'clear', 'golden'],
          texture: 'liquid',
          shape: 'bowl',
          size: 'large',
          colorProfile: {
            avgRed: 220,
            avgGreen: 200,
            avgBlue: 140,
            brightness: 187,
            colorVariance: 40
          }
        },
        searchKeywords: ['soto', 'soup', 'ayam', 'chicken', 'broth'],
        healthScore: 75
      }
    ];

    try {
      await FoodNutrition.insertMany(initialData);
      console.log(`✅ Database seeded dengan ${initialData.length} makanan dasar`);
    } catch (error) {
      console.error('❌ Failed to seed database:', error.message);
    }
  }

  async findFoodByVisual(imageCharacteristics) {
    try {
      if (!this.initialized || mongoose.connection.readyState !== 1) {
        return null;
      }

      const foods = await FoodNutrition.findByVisualCharacteristics(imageCharacteristics);
      
      if (foods && foods.length > 0) {
        // Return random food from matches untuk variasi
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        return randomFood;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error finding food by visual:', error.message);
      return null;
    }
  }

  async searchFood(keywords) {
    try {
      if (!this.initialized || mongoose.connection.readyState !== 1) {
        return [];
      }

      const foods = await FoodNutrition.searchByKeywords(keywords);
      return foods;
    } catch (error) {
      console.error('❌ Error searching food:', error.message);
      return [];
    }
  }

  calculateNutritionForServing(foodData, servingGrams = 150) {
    if (!foodData || !foodData.nutrition) {
      return null;
    }

    const multiplier = servingGrams / 100; // Database nutrition adalah per 100g
    
    return {
      carbs: Math.round(foodData.nutrition.carbohydrates * multiplier),
      protein: Math.round(foodData.nutrition.protein * multiplier),
      fat: Math.round(foodData.nutrition.fat * multiplier),
      veggies: this.estimateVeggieContent(foodData, servingGrams),
      calories: Math.round(foodData.nutrition.calories * multiplier),
      healthScore: foodData.healthScore || 70,
      foodName: foodData.name.indonesian,
      category: foodData.category
    };
  }

  estimateVeggieContent(foodData, servingGrams) {
    // Estimasi sayuran berdasarkan kategori makanan
    const multiplier = servingGrams / 100;
    
    if (foodData.category === 'vegetable') {
      return Math.round(foodData.nutrition.fiber * 20 * multiplier); // High veggie
    } else if (foodData.subCategory === 'salad' || foodData.subCategory === 'soup') {
      return Math.round(40 * multiplier); // Medium veggie
    } else if (foodData.category === 'protein' || foodData.category === 'grain') {
      return Math.round(15 * multiplier); // Low veggie (garnish)
    }
    
    return Math.round(25 * multiplier); // Default
  }

  estimateServingSize(imageSize, baseServing = 150) {
    // Estimasi ukuran porsi berdasarkan ukuran gambar
    const sizeFactor = Math.min(2.0, Math.max(0.5, imageSize / (500 * 1024)));
    return Math.round(baseServing * sizeFactor);
  }

  async getAllFoods() {
    try {
      if (!this.initialized || mongoose.connection.readyState !== 1) {
        return [];
      }

      return await FoodNutrition.find().select('foodId name category nutrition healthScore');
    } catch (error) {
      console.error('❌ Error getting all foods:', error.message);
      return [];
    }
  }

  async getNutritionByLabel(foodLabel) {
    try {
      if (!this.initialized || mongoose.connection.readyState !== 1) {
        // Fallback to static data if database not available
        return this.getStaticNutritionData(foodLabel);
      }

      // Query database by foodId (which matches foodLabel)
      const food = await FoodNutrition.findOne({ foodId: foodLabel });
      
      if (food) {
        console.log(`✅ Found nutrition data for: ${food.name.indonesian}`);
        return food;
      } else {
        // Try search by keywords if exact match not found
        const searchResults = await this.searchFood(foodLabel);
        if (searchResults.length > 0) {
          console.log(`✅ Found similar food: ${searchResults[0].name.indonesian}`);
          return searchResults[0];
        }
      }
      
      // Return fallback data if nothing found
      console.log(`⚠️ No data found for: ${foodLabel}, using fallback`);
      return this.getStaticNutritionData(foodLabel);
      
    } catch (error) {
      console.error('❌ Error getting nutrition by label:', error.message);
      return this.getStaticNutritionData(foodLabel);
    }
  }

  getStaticNutritionData(foodLabel) {
    // Static nutrition data as fallback when database not available
    const staticData = {
      nasi_putih: {
        foodId: 'nasi_putih',
        name: { indonesian: 'Nasi Putih', english: 'White Rice' },
        category: 'grain',
        nutrition: { carbohydrates: 28, protein: 2.7, fat: 0.3, fiber: 0.4, calories: 130 },
        healthScore: 65
      },
      ayam_goreng: {
        foodId: 'ayam_goreng', 
        name: { indonesian: 'Ayam Goreng', english: 'Fried Chicken' },
        category: 'protein',
        nutrition: { carbohydrates: 0, protein: 31.0, fat: 15.3, fiber: 0, calories: 250 },
        healthScore: 60
      },
      gado_gado: {
        foodId: 'gado_gado',
        name: { indonesian: 'Gado-Gado', english: 'Indonesian Salad' },
        category: 'vegetable', 
        nutrition: { carbohydrates: 12.5, protein: 4.8, fat: 8.9, fiber: 3.2, calories: 136 },
        healthScore: 85
      },
      rendang: {
        foodId: 'rendang',
        name: { indonesian: 'Rendang', english: 'Rendang Beef' },
        category: 'protein',
        nutrition: { carbohydrates: 5.2, protein: 22.6, fat: 19.0, fiber: 0.8, calories: 193 },
        healthScore: 70
      },
      soto_ayam: {
        foodId: 'soto_ayam',
        name: { indonesian: 'Soto Ayam', english: 'Chicken Soup' },
        category: 'protein',
        nutrition: { carbohydrates: 8.2, protein: 12.5, fat: 3.1, fiber: 0.8, calories: 108 },
        healthScore: 75
      },
      tempe_goreng: {
        foodId: 'tempe_goreng',
        name: { indonesian: 'Tempe Goreng', english: 'Fried Tempeh' },
        category: 'protein',
        nutrition: { carbohydrates: 9.4, protein: 20.8, fat: 8.8, fiber: 9.0, calories: 193 },
        healthScore: 80
      },
      makanan_campuran: {
        foodId: 'makanan_campuran',
        name: { indonesian: 'Makanan Campuran', english: 'Mixed Food' },
        category: 'mixed',
        nutrition: { carbohydrates: 45, protein: 15, fat: 8, fiber: 3, calories: 150 },
        healthScore: 70
      },
      sayur_hijau: {
        foodId: 'sayur_hijau',
        name: { indonesian: 'Sayur Hijau', english: 'Green Vegetables' },
        category: 'vegetable',
        nutrition: { carbohydrates: 8, protein: 3, fat: 0.5, fiber: 4, calories: 45 },
        healthScore: 90
      },
      sayur_campuran: {
        foodId: 'sayur_campuran',
        name: { indonesian: 'Sayur Campuran', english: 'Mixed Vegetables' },
        category: 'vegetable',
        nutrition: { carbohydrates: 10, protein: 3.5, fat: 1, fiber: 3.5, calories: 60 },
        healthScore: 88
      },
      nasi_goreng: {
        foodId: 'nasi_goreng',
        name: { indonesian: 'Nasi Goreng', english: 'Fried Rice' },
        category: 'grain',
        nutrition: { carbohydrates: 35, protein: 8, fat: 10, fiber: 1, calories: 260 },
        healthScore: 58
      }
    };

    return staticData[foodLabel] || staticData['makanan_campuran'];
  }
}

// Create singleton instance
const nutritionService = new NutritionService();

module.exports = nutritionService;