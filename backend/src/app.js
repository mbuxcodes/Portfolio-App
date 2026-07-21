import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';

const app = express();

// Security headers on every response
app.use(helmet());

// Only our own frontend origin may call this API, and cookies must be allowed through
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Temporary health-check route — proves the server boots correctly.
// Will be replaced by real feature routes in later steps.
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' }, message: 'Server is running' });
});

export default app;
