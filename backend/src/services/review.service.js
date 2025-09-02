const httpStatus = require('http-status');
const { Review, Listing } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (reviewBody) => {
    const listing = await Listing.findById(reviewBody.listingId);
    if (!listing) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Listing not found');
    }
    // TODO: In a real app, check if the user has a completed booking for this listing.
    return Review.create(reviewBody);
};

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
    const pipeline = [
        {
            $match: filter,
        },
        {
            $lookup: {
                from: 'users',
                localField: 'guestId',
                foreignField: '_id',
                as: 'guestInfo',
            },
        },
        {
            $unwind: { path: '$guestInfo', preserveNullAndEmptyArrays: true },
        },
        {
            $project: {
                _id: 1,
                rating: 1,
                comment: 1,
                createdAt: 1,
                guest: { id: '$guestInfo._id', name: '$guestInfo.name', profileImageUrl: '$guestInfo.profileImageUrl' },
            },
        },
    ];

    return Review.aggregatePaginate(pipeline, options);
};

module.exports = {
    createReview,
    queryReviews,
};

