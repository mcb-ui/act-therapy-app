import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import valuesRoutes from './routes/values.js';
import actionsRoutes from './routes/actions.js';
import favoritesRoutes from './routes/favorites.js';
import exerciseDataRoutes from './routes/exerciseData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
