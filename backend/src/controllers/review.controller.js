const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');
const pick = require('../utils/pick');

const createReview = catchAsync(async (req, res) => {
    const reviewBody = { ...req.body, guestId: req.user.id };
    const review = await reviewService.createReview(reviewBody);
    res.status(httpStatus.CREATED).send(review);
});

const getReviews = catchAsync(async (req, res) => {
    // Convert string listingId from params to a mongoose ObjectId for aggregation matching
    const filter = { listingId: new mongoose.Types.ObjectId(req.params.listingId) };
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await reviewService.queryReviews(filter, options);
    res.send(result);
});

module.exports = {
    createReview,
    getReviews,
};

