# Nutrivision Backend - Localhost MongoDB Setup

API untuk analisis nutrisi makanan dengan MongoDB localhost yang berjalan pada port 5000.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
File `.env` sudah dikonfigurasi untuk localhost:
```env
# MongoDB Configuration - Localhost
MONGODB_URI=mongodb://localhost:27017/nutrivision
PORT=5000
NODE_ENV=development
```

### 3. Pastikan MongoDB Localhost Berjalan
Pastikan MongoDB daemon berjalan di localhost:27017:
```bash
# Windows (jika menggunakan MongoDB Service)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# atau
mongod --dbpath /path/to/your/db
```

### 4. Seed Database dengan Data Nutrisi
```bash
npm run seed
```

### 5. Jalankan Server
```bash
# Development mode dengan nodemon
npm run dev

# Production mode
npm start
```

Server akan berjalan di: **http://localhost:5000**

## 📊 API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Nutrivision Backend is running!",
  "timestamp": "2026-06-04T08:44:04.143Z",
  "database": "Connected",
  "mlService": "Active"
}
```

### Complete Food Analysis (Workflow Lengkap)
```http
POST /api/nutrition/analyze
Content-Type: multipart/form-data

Body:
- image: [file gambar makanan]
```

**Response:**
```json
{
  "status": "success",
  "message": "Food analysis completed successfully",
  "data": {
    "foodLabel": "nasi_goreng",
    "foodName": "Nasi Goreng",
    "confidence": 0.85,
    "carbs": 42.5,
    "protein": 8.2,
    "veggies": 3.6,
    "calories": 260,
    "fat": 7.8,
    "fiber": 1.2,
    "healthScore": 60,
    "alternatives": [...],
    "servingSize": 200,
    "imageUrl": "/uploads/food-1717492444143-123456789.jpg",
    "analysisMethod": "AI Model + Database Lookup",
    "timestamp": "2026-06-04T08:44:04.143Z"
  }
}
```

### AI Model Classification Only
```http
POST /api/nutrition/predict
Content-Type: multipart/form-data

Body:
- image: [file gambar makanan]
```

**Response:**
```json
{
  "status": "success",
  "foodLabel": "nasi_goreng",
  "confidence": 0.85,
  "alternatives": [
    { "foodName": "nasi_putih", "confidence": 0.15 },
    { "foodName": "ayam_goreng", "confidence": 0.12 }
  ],
  "processingTime": "1.2s"
}
```

### Lookup Nutrition Data
```http
GET /api/nutrition/lookup/{foodLabel}
```

**Response:**
```json
{
  "status": "success",
  "foodLabel": "nasi_putih",
  "data": {
    "name": {
      "indonesian": "Nasi Putih",
      "english": "White Rice"
    },
    "nutrition": {
      "carbohydrates": 28.17,
      "protein": 2.69,
      "fat": 0.28,
      "fiber": 0.4,
      "calories": 130,
      "sodium": 1,
      "sugar": 0.05,
      "calcium": 10,
      "iron": 0.8,
      "vitaminC": 0
    },
    "healthScore": 65,
    "category": "grain"
  },
  "source": "MongoDB Atlas Database"
}
```

### Get All Available Foods
```http
GET /api/nutrition/foods
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "foodId": "nasi_putih",
      "name": {
        "indonesian": "Nasi Putih",
        "english": "White Rice"
      },
      "category": "grain"
    },
    {
      "foodId": "ayam_goreng",
      "name": {
        "indonesian": "Ayam Goreng",
        "english": "Fried Chicken"
      },
      "category": "protein"
    }
  ],
  "count": 8
}
```

### Get Food Analysis History
```http
GET /api/food-analyses
```

### Get Specific Analysis
```http
GET /api/food-analyses/{id}
```

### Delete Analysis
```http
DELETE /api/food-analyses/{id}
```

## 🍽️ Data Nutrisi Tersedia

Database localhost berisi 8 makanan sampel:

1. **Nasi Putih** - `nasi_putih` (Grain)
2. **Ayam Goreng** - `ayam_goreng` (Protein)  
3. **Gado-Gado** - `gado_gado` (Vegetable)
4. **Nasi Goreng** - `nasi_goreng` (Traditional)
5. **Tempe Goreng** - `tempe_goreng` (Plant-based Protein)
6. **Sayur Bayam** - `sayur_bayam` (Leafy Green)
7. **Ikan Bakar** - `ikan_bakar` (Seafood)
8. **Pisang Goreng** - `pisang_goreng` (Snack)

## 🔧 Menambah Data Nutrisi

Untuk menambah makanan baru ke database:

1. Edit file `seeders/nutritionSeeder.js`
2. Tambahkan data baru ke array `nutritionData`
3. Jalankan ulang seeder:
```bash
npm run seed
```

## 🌐 CORS Configuration

API mendukung request dari:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- Domain production yang dikonfigurasi di `.env`

## 📂 File Upload

- Gambar disimpan di direktori `uploads/`
- Maksimal ukuran file: 5MB
- Format yang didukung: JPG, PNG, WEBP
- Auto-generate filename dengan timestamp

## 🚨 Troubleshooting

### MongoDB Connection Error
```bash
# Cek status MongoDB
mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB service (Windows)
net stop MongoDB
net start MongoDB
```

### Port Already in Use
```bash
# Cek proses yang menggunakan port 5000
netstat -ano | findstr :5000

# Ubah PORT di file .env jika diperlukan
PORT=5001
```

### Seeder Error
```bash
# Pastikan MongoDB berjalan sebelum seed
npm run seed
```

## 🏗️ Arsitektur 6-Step Workflow

1. **Upload Image** → POST `/api/nutrition/analyze`
2. **AI Classification** → Internal call ke ML service
3. **Get Food Label** → Hasil: `nasi_goreng`
4. **Database Lookup** → Query MongoDB dengan foodLabel
5. **Calculate Nutrition** → Hitung porsi berdasarkan ukuran gambar
6. **Return JSON** → Response lengkap dengan data nutrisi

## 📱 Testing dengan Frontend

Jika menggunakan frontend React/Vue/Angular, pastikan:

1. Frontend berjalan di port yang terdaftar di CORS
2. Gunakan `FormData` untuk upload gambar
3. Handle response JSON sesuai struktur API

Contoh JavaScript:
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:5000/api/nutrition/analyze', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Nutrition data:', data.data);
});
```

## 💡 Tips

- Gunakan `npm run dev` untuk development (auto-reload)
- Monitor logs untuk debug koneksi database
- Test endpoints dengan Postman atau curl
- Backup database sebelum modifikasi besar

---

**Status**: ✅ Siap digunakan dengan MongoDB localhost
**Last Updated**: June 4, 2026