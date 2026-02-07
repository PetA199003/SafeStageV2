import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.API_PORT || '3000', 10),
  host: process.env.API_HOST || 'localhost',
  databaseUrl: process.env.DATABASE_URL || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};
