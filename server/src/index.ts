import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import valuesRoutes from './routes/values.js';
import actionsRoutes from './routes/actions.js';
import favoritesRoutes from './routes/favorites.js';
import exerciseDataRoutes from './routes/exerciseData.js';
import { config } from './lib/config.js';

const app = express();
const corsOptions = config.allowedOrigins.length
  ? { origin: config.allowedOrigins }
  : { origin: true };

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/values', valuesRoutes);
app.use('/api/actions', actionsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/exercise-data', exerciseDataRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ACT Therapy API is running',
    environment: config.nodeEnv,
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
