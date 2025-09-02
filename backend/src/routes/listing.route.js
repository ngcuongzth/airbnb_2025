const express = require('express');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { listingValidation } = require('../validations');
const { listingController } = require('../controllers');
const reviewRouter = require('./review.route');

const router = express.Router();

// Route to create a new listing. Requires authentication.
router
    .route('/')
    .post(auth(), validate(listingValidation.createListing), listingController.createListing)
    .get(validate(listingValidation.queryListings), listingController.getListings);

router
    .route('/:listingId')
    .get(validate(listingValidation.getListing), listingController.getListing)
    .patch(auth(), validate(listingValidation.updateListing), listingController.updateListing)
    .delete(auth(), validate(listingValidation.getListing), listingController.deleteListing);

// Nested route for reviews
router.use('/:listingId/reviews', reviewRouter);

module.exports = router;

