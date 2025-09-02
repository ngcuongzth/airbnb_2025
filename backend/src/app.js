const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');


const app = express();

// set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// enable cors 
app.use(cors());
app.options('*', cors());

// health check route
app.get('/', (req, res) => {
    res.send('Hello from Airbnb Clone Backend!');
});

// v1 api routes
app.use('/api/v1', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;

