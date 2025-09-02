const dotenv = require('dotenv');
const path = require('path');

// Load env vars from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3001,
    mongoose: {
        url: process.env.MONGODB_URI,
        options: {
            // New Mongoose options no longer require extensive configuration
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    },
};

