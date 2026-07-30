import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import uploadRoutes from './routes/upload.routes';
import cmsRoutes from './routes/cms.routes';
import contactRoutes from './routes/contact.routes';
import newsletterRoutes from './routes/newsletter.routes';
import paymentRoutes from './routes/payment.routes';
import analyticsRoutes from './routes/analytics.routes';
import env from './config/env';

const app = express();

// Trust reverse proxy for Render / Vercel load balancers
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Dynamic CORS configuration for production (supports comma-separated FRONTEND_URL)
const allowedOrigins = [
  ...env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, '')),
  'https://homedecore.homes',
  'https://www.homedecore.homes',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy blocked access from origin ${origin}`));
  },
  credentials: true,
}));

// Rate limiters for production security
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again in 15 minutes.' }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', apiLimiter);

app.use(compression());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  service: 'Homedecor API',
  environment: env.NODE_ENV,
  timestamp: new Date().toISOString()
}));

app.use(errorHandler);

export default app;