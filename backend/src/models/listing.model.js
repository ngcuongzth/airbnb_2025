
const mongoose = require('mongoose');
const toJSON = require('../plugins/toJSON.plugin');
const paginate = require('../plugins/paginate.plugin');
const aggregatePaginate = require('../plugins/aggregatePaginate.plugin');



const listingSchema = new mongoose.Schema(
    {
        hostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        // Note: For geospatial queries, create a 2dsphere index on this field
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere',
            required: true,
        },
        pricePerNight: {
            type: Number,
            required: true,
        },
        maxGuests: {
            type: Number,
            required: true,
            min: 1,
        },
        bedrooms: {
            type: Number,
            default: 1,
        },
        bathrooms: {
            type: Number,
            default: 1,
        },
        amenities: [String],
        status: {
            type: String,
            enum: ['active', 'inactive', 'pending'],
            default: 'pending',
        },
        avgRating: {
            type: Number,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);


/**
 * Check if title is taken
 * @param {string} title - The listing's title
 * @param {mongoose.ObjectId} [excludeListingId] - The id of the listing to be excluded
 * @returns {Promise<boolean>}
 */
listingSchema.statics.isTitleTaken = async function (title, excludeListingId) {
    const listing = await this.findOne({ title, _id: { $ne: excludeListingId } });
    return !!listing;
};


listingSchema.plugin(toJSON);
listingSchema.plugin(paginate);
listingSchema.plugin(aggregatePaginate);

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;