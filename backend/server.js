const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const rateLimit = require('express-rate-limit');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});

// Middleware
// Prepare allowed origins, stripping trailing slashes to prevent CORS mismatches
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173'
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/goals', require('./src/routes/goalRoutes'));
app.use('/api/habits', require('./src/routes/habitRoutes'));
app.use('/api/reflections', require('./src/routes/reflectionRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));
app.use('/api/pomodoro', require('./src/routes/pomodoroRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '禅 — Server is running peacefully' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✧ Zen Progress Tracker running on port ${PORT}`);
});
