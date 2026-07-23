import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';

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

// Middleware to ensure DB connection for every request in serverless
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

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

// Start Local Server ONLY if not in a serverless environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`⚙️  Local server running on port ${PORT}`);
  });
}

export default app;
