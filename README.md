# 🏪 POS Kasir System

Sistem Penjualan Modern untuk Toko/Warung dengan fitur lengkap.

## 📋 Fitur Utama

- ✅ **Sistem Kasir** - Scan barcode dan proses penjualan dengan cepat
- 📊 **Dashboard** - Laporan real-time penjualan dan keuntungan
- 📦 **Inventory** - Manajemen stok dan peringatan stok rendah
- 👥 **Multi User** - Admin, Manajer, dan Kasir dengan permission berbeda
- 💳 **Multi Payment** - Cash, Transfer, Debit, Credit Card, QRIS
- 📱 **Real-time Updates** - WebSocket untuk update real-time
- 📈 **Analytics** - Laporan penjualan harian, bulanan, dan produk terlaris

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Socket.IO

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Recharts (untuk grafik)
- Lucide Icons

## 📦 Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- npm atau yarn

### Dengan Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/Yolanda763/thenaipos.git
cd thenaipos

# Start semua service
docker-compose up -d

# Setup database
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Database: localhost:5432

### Local Development

**Backend Setup:**
```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Setup database
npm run migrate
npm run seed

# Start development server
npm run dev
```

**Frontend Setup:**
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

## 🔐 Demo Credentials

| Role   | Email                | Password      |
|--------|----------------------|---------------|
| Admin  | admin@thenai.com    | Admin@123456  |
| Manajer| manajer@thenai.com  | Manajer@123456|
| Kasir  | kasir@thenai.com    | Kasir@123456  |

## 📁 Project Structure

```
thenaipos/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register user baru
- `GET /api/auth/profile` - Get profile (Protected)

### Products
- `GET /api/products` - Get all products (Protected)
- `GET /api/products/barcode/:barcode` - Get product by barcode (Protected)
- `POST /api/products` - Create product (Admin/Manajer)
- `PUT /api/products/:id` - Update product (Admin/Manajer)

### Sales
- `POST /api/sales` - Create sale (Protected)
- `GET /api/sales` - Get sales (Protected)
- `GET /api/sales/:id` - Get sale detail (Protected)

### Reports
- `GET /api/reports/sales/daily` - Daily sales report (Admin/Manajer)
- `GET /api/reports/sales/monthly` - Monthly sales report (Admin/Manajer)
- `GET /api/reports/products/top` - Top products (Admin/Manajer)
- `GET /api/reports/inventory` - Inventory report (Admin/Manajer)

## 🚀 Deployment

### Deploy ke Production

```bash
# Build images
docker-compose -f docker-compose.yml build

# Push ke registry
docker tag thenaipos-backend your-registry/thenaipos-backend:latest
docker tag thenaipos-frontend your-registry/thenaipos-frontend:latest

# Deploy
docker-compose -f docker-compose.yml up -d
```

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/pos_kasir
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_APP_NAME=POS Kasir System
```

## 🤝 Contributing

Contributions are welcome! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

**TheNAI** - Sistem POS Modern untuk Indonesia

---

**Happy selling! 🎉**
