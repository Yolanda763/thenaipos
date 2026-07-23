import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authenticate, authorize } from './middleware/auth';
import { asyncHandler } from './middleware/asyncHandler';

// Load environment variables
dotenv.config();

const app: Express = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.SOCKET_IO_CORS || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Store io instance globally for use in other files
(global as any).io = io;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes').default);
app.use('/api/products', require('./routes/productRoutes').default);
app.use('/api/sales', require('./routes/saleRoutes').default);
app.use('/api/customers', require('./routes/customerRoutes').default);
app.use('/api/users', require('./routes/userRoutes').default);
app.use('/api/reports', require('./routes/reportRoutes').default);
app.use('/api/inventory', require('./routes/inventoryRoutes').default);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Socket.IO Events
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });

  // Real-time inventory updates
  socket.on('stock:updated', (data) => {
    io.emit('stock:updated', data);
  });

  // Real-time sales updates
  socket.on('sale:completed', (data) => {
    io.emit('sale:completed', data);
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 WebSocket running on port ${PORT}`);
});

export { app, io };
