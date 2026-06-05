# 🍽️ Nutrivision Backend API

Backend API untuk aplikasi analisis nutrisi makanan dengan AI, menggunakan dataset 43,729 makanan dari MongoDB Atlas.

## ✅ Status: Production Ready

- ✅ **Database**: MongoDB Atlas (43,729 makanan)
- ✅ **Connection**: Tested and working
- ✅ **API**: All endpoints functional
- ✅ **Deployment**: Ready for Vercel

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
File `.env` sudah configured dengan Atlas connection:
```env
MONGODB_URI=mongodb://kaye4u:hyyyunii98@ac-0nddz0z-shard-00-00...
```

### 3. Start Development Server
```bash
npm run dev
```

Server running at: **http://localhost:5000**

## 📊 API Endpoints

### Health Check
```http
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Nutrivision Backend is running!",
  "database": "Connected"
}
```

### Get All Foods
```http
GET /api/nutrition/foods
```

Returns: 50 sample foods from 43,729 total records

### Lookup Food by Name
```http
GET /api/nutrition/lookup/{foodName}
```

Example: `/api/nutrition/lookup/nasi`

### Analyze Food Image
```http
POST /api/nutrition/analyze
Content-Type: multipart/form-data

Body: image file
```

Returns: Complete nutrition analysis with AI classification

## 🗄️ Database

**MongoDB Atlas**
- Database: `dataset`
- Collection: `datasetmakanan`
- Records: 43,729 makanan
- Source: Data scientist nutrition dataset

### Dataset Coverage
- Indonesian traditional foods
- International cuisine
- Fast food chains (McDonald's, KFC, Pizza Hut, etc.)
- USDA nutritional data
- 292 food categories

## 🔧 Scripts

```bash
# Development
npm run dev              # Start with nodemon

# Production
npm start                # Production server

# Testing
npm run test:api         # Test all API endpoints
npm run check:db         # Check database connection

# Database
node quick-atlas-test.js # Test Atlas connection
```

## 🌐 Deployment

### Vercel Deployment

1. **Set Environment Variables** in Vercel dashboard:
```
MONGODB_URI=mongodb://kaye4u:hyyyunii98@ac-0nddz0z-shard-00-00.fbpmmmn.mongodb.net:27017,ac-0nddz0z-shard-00-01.fbpmmmn.mongodb.net:27017,ac-0nddz0z-shard-00-02.fbpmmmn.mongodb.net:27017/dataset?ssl=true&replicaSet=atlas-fmxr5g-shard-0&authSource=admin&appName=Cluster0

NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Test**:
```bash
curl https://your-api.vercel.app/api/health
curl https://your-api.vercel.app/api/nutrition/foods
```

## 📁 Project Structure

```
nutrition-backend-deploy2/
├── models/
│   ├── DatasetMakanan.js      # Atlas dataset model
│   └── FoodNutrition.js       # Backup model
├── routes/
│   └── nutritionRoutes.js     # API routes
├── services/
│   ├── nutritionService.js    # Business logic
│   ├── mlServiceNew.js        # ML integration
│   └── staticDataService.js   # Fallback data
├── .env                        # Atlas configuration
├── .env.production            # Production config
├── server.js                  # Main server
└── package.json               # Dependencies
```

## 🔑 Key Features

### 1. **Unified Database**
- Development dan production menggunakan Atlas
- Tidak perlu localhost MongoDB
- Data consistency terjamin

### 2. **Complete Dataset**
- 43,729 makanan dengan data nutrisi lengkap
- Kategori: protein, karbohidrat, lemak, serat, kalori, dll.
- Health scores dan risk factors

### 3. **AI Integration**
- ML model untuk food recognition
- Color-based food analysis
- Portion estimation

### 4. **Robust API**
- RESTful endpoints
- Error handling
- CORS configured
- File upload support

## 🧪 Testing

### Test Atlas Connection
```bash
node quick-atlas-test.js
```

Expected output:
```
✅ Connected successfully!
✅ Ping successful!
📊 Total records: 43,729
```

### Test API Endpoints
```bash
npm run test:api
```

Expected: All endpoints return 200 OK

## 📚 Documentation

- `UNIFIED-ATLAS-SETUP.md` - Atlas configuration guide
- `ATLAS-CONNECTION-SUCCESS.md` - Connection success details
- `DEPLOYMENT-GUIDE.md` - Deployment instructions

## 💡 Important Notes

### Atlas Connection
- **Internet required** untuk development
- Free tier: 512 MB storage (dataset ~24 MB)
- IP whitelist: 0.0.0.0/0 configured

### Localhost MongoDB
- **Not required** for development
- API uses Atlas for all environments
- Localhost only needed for offline development

### Security
- Connection string contains credentials
- Never commit `.env` to git
- Use environment variables in production

## 🐛 Troubleshooting

### Connection Issues
```bash
# Test connection
node quick-atlas-test.js

# Check logs
npm run dev
# Look for: "MongoDB Connected: ac-0nddz0z-shard-00-00..."
```

### API Not Working
```bash
# Check health
curl http://localhost:5000/api/health

# Should return: {"status":"OK","database":"Connected"}
```

### Data Not Found
- Verify Atlas cluster is running
- Check connection string in `.env`
- Confirm IP whitelist includes your IP

## 🎯 Development Workflow

1. **Start Server**: `npm run dev`
2. **Test Endpoints**: Use Postman or curl
3. **Check Logs**: Monitor console for errors
4. **Make Changes**: Code updates auto-reload
5. **Test Again**: Verify changes work
6. **Deploy**: Push to production

## 📞 Support

For issues or questions:
1. Check `UNIFIED-ATLAS-SETUP.md`
2. Review `ATLAS-CONNECTION-SUCCESS.md`
3. Test connection: `node quick-atlas-test.js`

---

**Version**: 1.0.0  
**Database**: MongoDB Atlas (dataset)  
**Records**: 43,729 makanan  
**Status**: 🟢 Production Ready