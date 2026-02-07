import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/v1', routes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(env.port, env.host, () => {
  console.log(`Safe Stage API läuft auf http://${env.host}:${env.port}`);
});
