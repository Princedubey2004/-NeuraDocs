require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// DB Init
connectDB();

// Core Middleware
app.use(express.json());
app.use(cors());
app.use(helmet()); 

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/documents', require('./routes/documentRoutes'));
app.use('/api/v1/ai', require('./routes/aiRoutes'));

app.get('/health', (req, res) => res.json({ up: true, time: new Date() }));

// Final Error Sink
app.use(errorMiddleware);

module.exports = app;
