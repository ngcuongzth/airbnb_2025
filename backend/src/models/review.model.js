const mongoose = require('mongoose');
const toJSON = require('../plugins/toJSON.plugin');
const paginate = require('../plugins/paginate.plugin');
const aggregatePaginate = require('../plugins/aggregatePaginate.plugin');

const reviewSchema = new mongoose.Schema(
    {
        listingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true,
        },
        guestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // In a real-world scenario, you'd also have a bookingId to ensure only users who completed a stay can review.
        // bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Static method to calculate and update listing stats
reviewSchema.statics.calculateStats = async function (listingId) {
    const stats = await this.aggregate([
        { $match: { listingId } },
        {
            $group: {
                _id: '$listingId',
                totalReviews: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    const update = stats.length > 0 ? { totalReviews: stats[0].totalReviews, avgRating: stats[0].avgRating.toFixed(2) } : { totalReviews: 0, avgRating: 0 };
    await mongoose.model('Listing').findByIdAndUpdate(listingId, update);
};

// Middleware to update stats after a new review is saved or deleted
reviewSchema.post('save', function () { this.constructor.calculateStats(this.listingId); });
reviewSchema.post('deleteOne', { document: true, query: false }, function () { this.constructor.calculateStats(this.listingId); });

reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);
reviewSchema.plugin(aggregatePaginate);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

