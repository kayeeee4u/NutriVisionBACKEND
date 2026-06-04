---
title: Nutrivision ML
emoji: 🍽️
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
---

# 🍽️ Nutrivision ML Server

TensorFlow-based food classification API with 174 food classes for Indonesian and international foods.

## 🎯 Features

- **174 Food Classes**: Including 43 Indonesian dishes and 131 international cuisines
- **TensorFlow Model**: Pre-trained deep learning model for accurate food recognition
- **Complete Nutrition Data**: Calories, carbs, protein, fat, fiber, vegetables, and health score
- **RESTful API**: Simple HTTP endpoints for easy integration

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "modelLoaded": true,
  "numClasses": 174
}
```

### Food Prediction
```bash
POST /predict
Content-Type: multipart/form-data

Body: image file
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "foodName": "Nasi Goreng",
    "foodNameEn": "Fried Rice",
    "carbs": 55,
    "protein": 12,
    "fat": 8,
    "calories": 345,
    "fiber": 2,
    "veggies": 50,
    "confidence": 0.6,
    "healthScore": 58
  },
  "alternatives": [
    {"foodName": "Nasi Uduk", "confidence": 0.5},
    {"foodName": "Fried Rice", "confidence": 0.4}
  ],
  "method": "TensorFlow SavedModel (174 classes)"
}
```

## 🍲 Supported Foods

### Indonesian Foods (43 types):
- **Rice & Carbs**: Nasi Putih, Nasi Goreng, Nasi Uduk, Nasi Kuning, Nasi Padang, Mie Goreng
- **Protein**: Ayam Goreng, Rendang, Sate Ayam, Tempe Goreng, Tahu Goreng, Ikan Bakar
- **Vegetables**: Gado-Gado, Karedok, Cap Cay, Sayur Asem, Sayur Lodeh
- **Soups**: Soto Ayam, Rawon, Sop Buntut, Bakso
- **Snacks**: Pempek, Siomay, Batagor, Martabak

### International Foods (131 types):
- American, Italian, Japanese, Chinese, and many more cuisines

## 🚀 Usage Example

```python
import requests

# Upload image
with open('food.jpg', 'rb') as f:
    response = requests.post(
        'https://YOUR-SPACE-URL/predict',
        files={'image': f}
    )
    
result = response.json()
print(f"Detected: {result['prediction']['foodName']}")
print(f"Calories: {result['prediction']['calories']} kcal")
```

## 🔧 Technology Stack

- **Framework**: Flask 3.1.0
- **ML Engine**: TensorFlow 2.18.0 (CPU)
- **Image Processing**: Pillow 11.1.0
- **Deployment**: Docker on Hugging Face Spaces

## 📊 Model Details

- **Architecture**: Pre-trained CNN
- **Input Shape**: (224, 224, 3) RGB image
- **Output**: Probability distribution over 174 food classes
- **Preprocessing**: Resize to 224x224, normalize to [0, 1]

## 🎓 Created By

This ML server is part of the Nutrivision project - an AI-powered food nutrition analysis application.

## 📝 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**🍽️ Nutrivision - AI-Powered Nutrition Analysis**
