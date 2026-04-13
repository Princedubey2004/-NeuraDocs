const app = require('./app');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { setupSocketIO } = require('./sockets/socketHandler');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const server = http.createServer(app);

// Setup Socket.io for real-time collaboration
const io = socketIO(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

setupSocketIO(io);

const PORT = process.env.PORT || 5005;

/**
 * Start the engine!
 * Using server.listen instead of app.listen because we have sockets.
 */
server.listen(PORT, () => {
    console.log(`\n--------------------------------------------`);
    console.log(`🚀 NEURADOCS BACKEND IS RUNNING!`);
    console.log(`🛠️  Port: ${PORT}`);
    console.log(`🌐 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`--------------------------------------------\n`);
});
