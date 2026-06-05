// TensorFlow TFJS removed (model dijalankan di Flask Hugging Face Space)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const nutritionService = require('./nutritionService');

// Pastikan di Railway di-set ke: https://kayeeee4u-nutrivision-ml.hf.space
const ML_SERVER_URL = process.env.HF_API_URL || 'https://kayeeee4u-nutrivision-ml.hf.space';

class MLService {
  constructor() {
    this.model = null;
    this.modelLoaded = false;
    this.modelPath = path.join(__dirname, '../../saved_model1');
  }

  async loadModel() {
    try {
      console.log('🤖 Initializing Hugging Face ML Service...');
      console.log('🌐 Target Server:', ML_SERVER_URL);
      
      // Cek Flask ML server di Hugging Face
      await this._checkFlaskServer();
      
      // Initialize nutrition service
      await nutritionService.initialize();
      
      this.modelLoaded = this.flaskAvailable;
      return this.flaskAvailable;
      
    } catch (error) {
      console.error('❌ Failed to load ML model connection:', error.message);
      console.log('⚠️ Fallback: Using MongoDB Atlas nutrition database + intelligent analysis');
      
      await nutritionService.initialize();
      this.modelLoaded = false;
      return false;
    }
  }

  // ── Flask Hugging Face server helpers ───────────────────────────────────────

  async _checkFlaskServer() {
    try {
      // Menembak endpoint GET /health bawaan app.py
      const health = await this._httpGet(`${ML_SERVER_URL}/health`);
      if (health.status === 'ok' && health.modelLoaded) {
        this.flaskAvailable = true;
        console.log(`[ML] Hugging Face Flask server ONLINE — ${health.numClasses} kelas siap`);
      } else {
        this.flaskAvailable = false;
        console.log('[ML] Hugging Face server reachable tapi model di app.py gagal dimuat');
      }
    } catch (err) {
      this.flaskAvailable = false;
      console.log('[ML] Hugging Face server tidak merespons health check — gunakan color analysis fallback');
    }
  }

  _httpGet(url) {
    return new Promise((resolve, reject) => {
      const isHttps = url.startsWith('https:');
      const httpModule = isHttps ? https : http;

      httpModule.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => { 
          try { 
            resolve(JSON.parse(data)); 
          } catch (e) { 
            reject(e); 
          } 
        });
      }).on('error', reject);
    });
  }

  _postImageToFlask(imagePath) {
    return new Promise((resolve, reject) => {
      try {
        const imageBuffer = fs.readFileSync(imagePath);
        const boundary = '----NutrivisionBoundary' + Date.now();
        
        // Sesuai app.py: request.files['image']
        const header = Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="${path.basename(imagePath)}"\r\nContent-Type: image/jpeg\r\n\r\n`
        );
        const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
        const body = Buffer.concat([header, imageBuffer, footer]);

        const mlUrl = new URL(`${ML_SERVER_URL}/predict`);
        const isHttps = mlUrl.protocol === 'https:';
        const httpModule = isHttps ? https : http;
        
        const options = {
          hostname: mlUrl.hostname,
          port: mlUrl.port || (isHttps ? 443 : 80),
          path: mlUrl.pathname,
          method: 'POST',
          headers: { 
            'Content-Type': `multipart/form-data; boundary=${boundary}`, 
            'Content-Length': body.length 
          }
        };

        const req = httpModule.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => { 
            try { 
              resolve(JSON.parse(data)); 
            } catch { 
              reject(new Error('Invalid JSON dari Flask Hugging Face')); 
            } 
          });
        });

        req.on('error', reject);
        // Timeout 25 detik untuk mengantisipasi cold start container di Hugging Face
        req.setTimeout(25000, () => { req.destroy(); reject(new Error('Flask HF timeout')); });
        req.write(body);
        req.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async preprocessImage(imagePath) {
    try {
      console.log('📸 Processing image for fallback:', imagePath);
      const imageInfo = await sharp(imagePath).metadata();
      
      const { data, info } = await sharp(imagePath)
        .resize(224, 224)
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      return { data, info, originalInfo: imageInfo };
    } catch (error) {
      console.error('❌ Image preprocessing failed:', error.message);
      throw error;
    }
  }

  async predictNutrition(imagePath) {
    try {
      console.log('🔮 Analyzing food image...');

      // --- Prioritas 1: Flask ML server Hugging Face ---
      await this._checkFlaskServer();
      if (this.flaskAvailable) {
        try {
          const result = await this._postImageToFlask(imagePath);
          if (result.success && result.prediction) {
            const p = result.prediction;
            console.log(`[ML] Flask HF predict: ${p.foodName} (${p.confidence}%)`);
            return {
              carbs: p.carbs,
              protein: p.protein,
              veggies: p.veggies,
              healthScore: p.healthScore,
              foodName: p.foodName,
              foodNameEn: p.foodNameEn,
              calories: p.calories,
              fat: p.fat,
              fiber: p.fiber,
              confidence: p.confidence,
              alternatives: result.alternatives || []
            };
          }
        } catch (flaskErr) {
          console.warn('[ML] Flask HF error, fallback ke color analysis:', flaskErr.message);
          this.flaskAvailable = false;
        }
      }

      // --- Prioritas 2: Color analysis fallback + MongoDB ---
      const imageData = await this.preprocessImage(imagePath);
      const characteristics = this.analyzeImageCharacteristics(imageData);
      const matchedFood = await nutritionService.findFoodByVisual(characteristics);
      
      let nutrition;
      if (matchedFood) {
        const servingSize = nutritionService.estimateServingSize(
          imageData.originalInfo.size || (imageData.originalInfo.width * imageData.originalInfo.height * 3)
        );
        nutrition = nutritionService.calculateNutritionForServing(matchedFood, servingSize);
        console.log(`🍽️ Makanan dari DB: ${matchedFood.name.indonesian}`);
      } else {
        nutrition = this.analyzeImageCharacteristicsLegacy(imageData);
        console.log('🔄 Menggunakan analisis visual fallback');
      }
      
      return nutrition;
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      return this.getMockPrediction();
    }
  }

  analyzeImageCharacteristics(imageData) {
    try {
      const { data, info, originalInfo } = imageData;
      let avgRed = 0, avgGreen = 0, avgBlue = 0;
      let totalPixels = info.width * info.height;
      
      const channels = info.channels || 3;
      const pixelStep = channels >= 3 ? 3 : 1;
      
      for (let i = 0; i < data.length; i += pixelStep) {
        if (channels >= 3) {
          avgRed += data[i] || 0;
          avgGreen += data[i + 1] || 0; 
          avgBlue += data[i + 2] || 0;
        } else {
          const gray = data[i] || 0;
          avgRed += gray; avgGreen += gray; avgBlue += gray;
        }
      }
      
      avgRed = avgRed / totalPixels || 128;
      avgGreen = avgGreen / totalPixels || 128;
      avgBlue = avgBlue / totalPixels || 128;
      
      const brightness = (avgRed + avgGreen + avgBlue) / 3;
      const colorVariance = Math.abs(avgRed - avgGreen) + Math.abs(avgGreen - avgBlue) + Math.abs(avgBlue - avgRed);
      
      return { avgRed, avgGreen, avgBlue, brightness, colorVariance, imageSize: originalInfo.size || (originalInfo.width * originalInfo.height * 3) };
    } catch (error) {
      return { avgRed: 128, avgGreen: 128, avgBlue: 128, brightness: 128, colorVariance: 50, imageSize: 500000 };
    }
  }

  analyzeImageCharacteristicsLegacy(imageData) {
    const characteristics = this.analyzeImageCharacteristics(imageData);
    const { avgRed, avgGreen, avgBlue } = characteristics;
    const colorRatio = { red: avgRed / 255, green: avgGreen / 255, blue: avgBlue / 255 };
    
    let carbs = 120, protein = 30, veggies = 40, healthScore = 65;
    if (colorRatio.green > 0.6) { veggies = 100; carbs = 45; healthScore = 85; }
    else if (avgRed > 140 && avgGreen > 110 && avgBlue < 120) { carbs = 160; healthScore = 55; }
    
    return { carbs, protein, veggies, healthScore, foodName: 'Makanan Campuran', category: 'mixed' };
  }

  async classifyFood(imagePath) {
    try {
      console.log('🤖 AI Model: Starting food classification...');
      const startTime = Date.now();

      // --- Prioritas 1: Flask ML server Hugging Face ---
      await this._checkFlaskServer();
      if (this.flaskAvailable) {
        try {
          const result = await this._postImageToFlask(imagePath);
          if (result.success && result.prediction) {
            const p = result.prediction;
            const processingTime = Date.now() - startTime;
            return {
              success: true,
              foodLabel: p.foodName?.replace(/\s+/g, '_').toLowerCase() || 'unknown_food',
              confidence: p.confidence / 100,
              alternatives: (result.alternatives || []).map(a => ({ label: a.foodName, confidence: a.confidence / 100 })),
              processingTime: `${processingTime}ms`,
              source: 'huggingface_flask'
            };
          }
        } catch (flaskErr) {
          console.warn('[ML] Flask HF classify error, fallback:', flaskErr.message);
          this.flaskAvailable = false;
        }
      }

      // --- Prioritas 2: Color analysis fallback ---
      const imageData = await this.preprocessImage(imagePath);
      const characteristics = this.analyzeImageCharacteristics(imageData);
      const foodLabel = await this.determineFoodLabel(characteristics);
      const confidence = this.calculateConfidence(characteristics) / 100;
      const alternatives = await this.getAlternativeLabels(characteristics);
      const processingTime = Date.now() - startTime;

      return { success: true, foodLabel, confidence, alternatives, processingTime: `${processingTime}ms`, source: 'color_analysis' };
    } catch (error) {
      return { success: false, foodLabel: 'unknown_food', confidence: 0, error: error.message };
    }
  }

  async determineFoodLabel(characteristics) {
    const { avgRed, brightness, colorVariance } = characteristics;
    if (brightness > 200 && colorVariance < 30) return 'nasi_putih';
    if (avgRed > 140 && colorVariance > 40) return 'nasi_goreng';
    return 'makanan_campuran';
  }

  calculateConfidence(characteristics) {
    return 75;
  }

  async getAlternativeLabels(characteristics) {
    return [{ label: 'nasi_putih', confidence: 0.3 }];
  }

  getMockPrediction() {
    return { carbs: 120, protein: 40, veggies: 60, healthScore: 70, foodName: 'Makanan Mock (Fallback)', calories: 320, fat: 10, fiber: 3, confidence: null, alternatives: [] };
  }

  async analyzeFood(imagePath) {
    try {
      console.log('🍽️ Starting food analysis for:', imagePath);
      const nutrition = await this.predictNutrition(imagePath);
      return { success: true, nutrition, method: 'Hugging Face Flask Cloud Server + AI Visual Analysis' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new MLService();
