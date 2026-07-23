# 🏪 POS KASIR SYSTEM - Production Ready

Aplikasi Point of Sale (POS) kasir yang modern, real-time, dan user-friendly untuk toko retail, cafe, atau restoran.

## ✨ Fitur Utama

- ✅ **Multi-User Management** - Admin, Kasir, Manajer
- ✅ **Real-time Synchronization** - WebSocket untuk sync data instan
- ✅ **Smart Inventory Management** - Stok otomatis + Alert
- ✅ **Multiple Payment Methods** - Cash, Transfer, QRIS, Debit/Kredit
- ✅ **Advanced Reporting** - Laporan penjualan, stok, laba/rugi
- ✅ **Customer Management** - Profil pelanggan + History transaksi
- ✅ **Multi-Outlet Support** - Kelola beberapa cabang
- ✅ **Barcode Scanner Integration** - Support barcode reader
- ✅ **Digital & Print Receipts** - Cetak/Email/Simpan struk
- ✅ **Security & Encryption** - JWT Auth, Password Hashing
- ✅ **Offline Mode** - Bisa transaksi tanpa internet
- ✅ **Dashboard Analytics** - Visualisasi penjualan real-time

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- PostgreSQL + Prisma ORM
- Socket.io (Real-time)
- JWT Authentication
- Winston Logger

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Socket.io Client
- Axios + React Query
- Redux Toolkit
- Chart.js / Recharts

### DevOps
- Docker & Docker Compose
- Google Cloud Run
- PostgreSQL Cloud SQL
- GitHub Actions (CI/CD)

## 📋 Requirement

- Node.js >= 18
- npm atau yarn
- PostgreSQL >= 12
- Docker (optional)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Yolanda763/thenaipos.git
cd thenaipos
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan database credentials
npm run migrate
npm run seed
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

## 📊 Default Login Credentials

```
Admin:
- Email: admin@thenai.com
- Password: Admin@123456

Kasir:
- Email: kasir@thenai.com
- Password: Kasir@123456

Manajer:
- Email: manajer@thenai.com
- Password: Manajer@123456
```

## 📁 Project Structure

```
thenaipos/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── socket/
│   │   └── app.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── docs/
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    └── DEPLOYMENT.md
```

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

## 📚 Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 📞 Support & Contact

- Email: support@thenai.com
- Issue Tracker: GitHub Issues

## 📄 License

MIT License

---

**Made with ❤️ by TheNAI Development Team**
