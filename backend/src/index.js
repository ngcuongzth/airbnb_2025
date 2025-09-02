const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/db');

let server;

// Connect to MongoDB & start server
connectDB().then(() => {
    server = app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

