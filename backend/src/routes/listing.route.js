const express = require('express');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const { listingValidation } = require('../validations');
const { listingController } = require('../controllers');
const { listingReviewsRouter } = require('./review.route');
const { nestedRouter: bookingRouter } = require('./booking.route');

const router = express.Router();

// Route to create a new listing. Requires authentication.
router
    .route('/')
    .post(auth(), authorize('host'), validate(listingValidation.createListing), listingController.createListing)
    .get(validate(listingValidation.queryListings), listingController.getListings);

router
    .route('/:listingId')
    .get(validate(listingValidation.getListing), listingController.getListing)
    .patch(auth(), authorize('host'), validate(listingValidation.updateListing), listingController.updateListing)
    .delete(auth(), authorize('host'), validate(listingValidation.getListing), listingController.deleteListing);

// Nested route for reviews
router.use('/:listingId/reviews', listingReviewsRouter);
// Nested route for bookings
router.use('/:listingId/bookings', bookingRouter);

module.exports = router;

