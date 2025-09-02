const express = require('express');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { reviewValidation } = require('../validations');
const { reviewController } = require('../controllers');

const router = express.Router({ mergeParams: true }); // Important: mergeParams allows access to :listingId

router.route('/').post(auth(), validate(reviewValidation.createReview), reviewController.createReview).get(validate(reviewValidation.getReviews), reviewController.getReviews);

module.exports = router;

