const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware - CORS configuration
// Support multiple origins for development and production
const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim()).filter(Boolean)
  : [];

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://abunearegawi.nl',
  'https://www.abunearegawi.nl',
  ...envOrigins,
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const originToCheck = origin.toLowerCase();

    // Allow localhost for development
    if (originToCheck.startsWith('http://localhost:') || originToCheck.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Allow all Vercel deployments (production and preview)
    if (originToCheck.includes('.vercel.app')) {
      return callback(null, true);
    }

    // Allow primary domain and subdomains
    if (originToCheck === 'https://abunearegawi.nl' || originToCheck.endsWith('.abunearegawi.nl')) {
      return callback(null, true);
    }
    
    // Allow exact match from configured origins
    if (allowedOrigins.includes(originToCheck)) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/members', require('./routes/members'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/church_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected');
  
  // Start payment reminder cron job after DB connection
  const { startPaymentReminderCron } = require('./utils/paymentReminderCron');
  startPaymentReminderCron();
})
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

