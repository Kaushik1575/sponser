require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api.routes');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Sponsor Backend API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Sponsor Backend Server running on port ${PORT}`);
});
