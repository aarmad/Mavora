import express from 'express';
import cors from 'cors';
import authRoutes    from './routes/auth';
import serviceRoutes from './routes/services';
import requestRoutes from './routes/requests';
import adminRoutes   from './routes/admin';

const app = express();

const allowedOrigins = (process.env['CORS_ORIGINS'] || 'http://localhost:5173').split(',');

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman) and whitelisted origins
    if (!origin || allowedOrigins.some((o) => origin.startsWith(o.trim()))) {
      cb(null, true);
    } else {
      cb(new Error(`CORS: ${origin} non autorisé`));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin',    adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'Mavora API', env: process.env['NODE_ENV'] });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.message);
  res.status(500).json({ message: 'Erreur serveur interne' });
});

export default app;
