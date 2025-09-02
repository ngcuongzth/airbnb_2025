const express = require('express');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { reviewValidation } = require('../validations');
const { reviewController } = require('../controllers');

const router = express.Router();

// This route is now a top-level route for creating reviews
router.route('/').post(auth(), validate(reviewValidation.createReview), reviewController.createReview);

// We will create a separate router for getting reviews for a listing to keep things clean
const listingReviewsRouter = express.Router({ mergeParams: true });
listingReviewsRouter.route('/').get(validate(reviewValidation.getReviews), reviewController.getReviews);

module.exports = { reviewRouter: router, listingReviewsRouter };

