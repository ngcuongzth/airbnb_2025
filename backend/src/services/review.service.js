// review.service.js
// TODO: In a real app, check if the user has a completed booking for this listing.

const httpStatus = require('http-status');
const { Review, Booking } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (reviewBody) => {
    const { bookingId, guestId } = reviewBody;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    if (!booking.guestId.equals(guestId)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You can only review your own bookings');
    }

    if (booking.status !== 'confirmed' && booking.status !== 'completed') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You can only review confirmed or completed bookings');
    }

    if (new Date(booking.checkOut) > new Date()) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You can only review a booking after the check-out date');
    }

    return Review.create({ ...reviewBody, listingId: booking.listingId });
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

