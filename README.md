# Nutrivision Backend

Backend server untuk aplikasi Nutrivision - analisis nutrisi makanan menggunakan gambar.

## 🚀 Fitur

- Upload gambar makanan
- Analisis nutrisi otomatis (simulasi AI)
- Penyimpanan data ke MongoDB
- REST API untuk frontend
- CORS support untuk komunikasi dengan frontend
- File upload dengan validasi

## 🛠️ Teknologi

- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **MongoDB** - Database NoSQL
- **Mongoose** - MongoDB ODM
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 📋 Prasyarat

- Node.js (v14 atau lebih baru)
- MongoDB (lokal atau cloud)
- npm atau yarn

## 🔧 Instalasi

1. Install dependencies:
```bash
npm install
```

2. Konfigurasi environment variables di `.env`:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nutrivision
FRONTEND_URL=http://localhost:5173
```

3. Pastikan MongoDB berjalan (jika menggunakan lokal)

4. Jalankan server:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Food Analysis
```
POST /api/analyze-food
Content-Type: multipart/form-data
Body: image file
```

### Get All Analyses
```
GET /api/food-analyses
```

### Get Specific Analysis
```
GET /api/food-analyses/:id
```

### Delete Analysis
```
DELETE /api/food-analyses/:id
```

## 📊 Database Schema

### FoodAnalysis Collection
```javascript
{
  imageName: String,
  imagePath: String,
  nutritionData: {
    carbs: Number,
    protein: Number,
    veggies: Number,
    healthScore: Number
  },
  createdAt: Date
}
```

## 🔒 Keamanan

- File size limit: 5MB
- Hanya menerima file gambar
- CORS dikonfigurasi untuk frontend yang diizinkan
- Input validation pada semua endpoints

## 📝 Logs

Server akan menampilkan:
- MongoDB connection status
- Server running confirmation
- Error logs untuk debugging

## 🚨 Troubleshooting

**MongoDB Connection Error:**
- Pastikan MongoDB service berjalan
- Periksa MONGODB_URI di .env
- Pastikan database accessible

**File Upload Error:**
- Periksa direktori `uploads/` ada
- Pastikan file size tidak melebihi 5MB
- Pastikan file adalah format gambar

**CORS Error:**
- Periksa FRONTEND_URL di .env
- Pastikan origin frontend sudah dikonfigurasi

## 📞 Support

Jika ada masalah, periksa:
1. MongoDB connection
2. Environment variables
3. Port availability
4. File permissions