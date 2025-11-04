import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import valuesRoutes from './routes/values.js';
import actionsRoutes from './routes/actions.js';
import favoritesRoutes from './routes/favorites.js';
import exerciseDataRoutes from './routes/exerciseData.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS - permissive for dev, can be locked down via CLIENT_ORIGIN env
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
}));

// JSON parsing with size limit
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/values', valuesRoutes);
app.use('/api/actions', actionsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/exercise-data', exerciseDataRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ACT Therapy API is running' });
});

// Centralized error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
