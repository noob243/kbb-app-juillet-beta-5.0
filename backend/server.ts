import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import clientRoutes from './routes/clients';
import caseRoutes from './routes/cases';
import eventRoutes from './routes/events';
import taskRoutes from './routes/tasks';
import invoiceRoutes from './routes/invoices';
import avocatRoutes from './routes/avocats';
import chatRoutes from './routes/chat';
import personnelRoutes from './routes/personnels';
import fournisseurRoutes from './routes/fournisseurs';
import auditLogRoutes from './routes/auditLogs';
import correspondanceRoutes from './routes/correspondances';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection Logic
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🚀 MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/avocats', avocatRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/personnels', personnelRoutes);
app.use('/api/fournisseurs', fournisseurRoutes);
app.use('/api/auditLogs', auditLogRoutes);
app.use('/api/correspondances', correspondanceRoutes);
app.use('/api/users', userRoutes);

// Basic Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'active',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Server ONLY if not in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️  Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  });
} else {
  // Ensure DB connection for serverless requests
  connectDB();
}

export default app;
