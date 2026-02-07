import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import adminRouter from './routes/admin.routes';

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Health check
app.get('/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin interface
app.use('/admin', adminRouter);

// API Routes
app.use('/v1', routes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(env.port, env.host, () => {
  console.log(`Safe Stage API läuft auf http://${env.host}:${env.port}`);
  console.log(`Admin-Oberfläche: http://${env.host}:${env.port}/admin`);
});
