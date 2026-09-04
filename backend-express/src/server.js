const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const chatRoutes = require('./routes/chatRoutes');
const merchantRoutes = require('./routes/merchantRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database connection
connectDB();

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/audit', auditRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    component: 'Node.js / Express MERN Application Gateway',
    gemini_connected: !!process.env.GEMINI_API_KEY,
    gatekeeper_target: process.env.GATEKEEPER_URL || 'http://localhost:8080/api/v1/gatekeeper'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Aegis-AP2 Express Application Gateway running on port ${PORT}`);
  console.log(` Architecture: MERN Application Layer & Gemini Negotiator`);
  console.log(`=======================================================`);
});
