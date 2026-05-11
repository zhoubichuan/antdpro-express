require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 7001;

// --- Middleware ---
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Routes ---
Object.keys(routes).forEach(key => {
  app.use('/api', routes[key]);
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    code: statusCode,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    data: null
  });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'API Not Found', data: null });
});

// --- Static Files & Start ---
app.use(express.static('public'));
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;