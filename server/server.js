import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import apiRoutes, { seedAdminAccount } from './routes/api.js';
import { initDb } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Managed by Vite dev proxy in development
    crossOriginEmbedderPolicy: false
  })
);

// CORS settings
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true
  })
);

// Body and Cookie parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Rate Limiting (Prevents Brute-force & Denial of Service attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests from this IP. Please try again later.' }
});

const submissionLimiter = rateLimit({
  windowMs: 2 * 60 * 60 * 1000, // 2 hours window
  max: 10, // Limit form submissions to 10 per 2 hours per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    success: false, 
    error: 'You have reached the submission limit. Please wait 2 hours before submitting another request.' 
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts. Please wait 15 minutes before trying again.'
  }
});

app.use('/api', apiLimiter);
app.use('/api/consultations', submissionLimiter);
app.use('/api/admin/login', loginLimiter);

// Register API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function startServer() {
  await initDb();
  await seedAdminAccount();
  
  app.listen(PORT, () => {
    console.log(`🚀 Infronix Backend Server running on http://localhost:${PORT}`);
    console.log(`🔒 Encryption: AES-256-GCM Enabled`);
    console.log(`🛡️ Rate Limiting (2h window) & Helmet Security Active`);
  });
}

startServer();
