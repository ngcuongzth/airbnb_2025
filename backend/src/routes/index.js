// Main router that aggregates all other feature routes for v1

const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const listingRoute = require('./listing.route');
const { topLevelRouter: bookingRoute } = require('./booking.route');
const { reviewRouter } = require('./review.route');


const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/listings',
        route: listingRoute,
    },
    {
        path: '/bookings',
        route: bookingRoute,
    },
    {
        path: '/reviews',
        route: reviewRouter,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;

