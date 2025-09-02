const httpStatus = require('http-status');
const { Listing } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a listing
 * @param {Object} listingBody
 * @returns {Promise<Listing>}
 */
const createListing = async (listingBody) => {
    if (await Listing.isTitleTaken(listingBody.title)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Listing title already taken');
    }
    // Explicitly set the status to 'active' upon creation, overriding the schema default.
    // This provides a better out-of-the-box experience for a system without an admin approval flow.
    return Listing.create({ ...listingBody, status: 'active' });
};

/**
 * Get listing by id
 * @param {mongoose.ObjectId} id
 * @returns {Promise<Listing>}
 */
const getListingById = async (id) => {
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Listing not found');
    }
    return listing;
};

/**
 * Query for listings with advanced filtering and pagination
 * @param {Object} filterOptions - Filtering options
 * @param {Object} paginateOptions - Pagination options
 * @returns {Promise<QueryResult>}
 */
const queryListings = async (filterOptions, paginateOptions) => {
    const pipeline = [];

    // Stage 1 (optional): Geospatial search with $geoNear. Must be the first stage.
    if (filterOptions.near) {
        const [lng, lat, distKm] = filterOptions.near.split(',').map(parseFloat);
        if (!isNaN(lng) && !isNaN(lat) && !isNaN(distKm)) {
            pipeline.push({
                $geoNear: {
                    near: { type: 'Point', coordinates: [lng, lat] },
                    distanceField: 'distance', // Adds a 'distance' field in meters
                    maxDistance: distKm * 1000, // max distance in meters
                    spherical: true,
                },
            });
        }
    }

    // Stage 2: Lookup host information
    pipeline.push({
        $lookup: {
            from: 'users', // The name of the User collection
            localField: 'hostId',
            foreignField: '_id',
            as: 'hostInfo',
        },
    });

    // Deconstruct the hostInfo array.
    pipeline.push({ $unwind: { path: '$hostInfo', preserveNullAndEmptyArrays: true } });

    // Stage 2.5: Reshape the host information into a nested object
    pipeline.push({
        $addFields: {
            host: {
                id: '$hostInfo._id',
                name: '$hostInfo.name',
                profileImageUrl: '$hostInfo.profileImageUrl',
            },
        },
    });

    // Stage 3: Match stage for all other filters
    const matchStage = {};
    if (filterOptions.title) {
        matchStage.title = { $regex: filterOptions.title, $options: 'i' };
    }
    if (filterOptions.hostName) {
        matchStage['hostInfo.name'] = { $regex: filterOptions.hostName, $options: 'i' };
    }
    if (filterOptions.maxGuests) {
        matchStage.maxGuests = { $gte: parseInt(filterOptions.maxGuests, 10) };
    }
    if (filterOptions.price_min || filterOptions.price_max) {
        matchStage.pricePerNight = {};
        if (filterOptions.price_min) {
            matchStage.pricePerNight.$gte = parseInt(filterOptions.price_min, 10);
        }
        if (filterOptions.price_max) {
            matchStage.pricePerNight.$lte = parseInt(filterOptions.price_max, 10);
        }



    }
    if (filterOptions.bedrooms) {
        matchStage.bedrooms = { $gte: parseInt(filterOptions.bedrooms, 10) };
    }
    if (filterOptions.bathrooms) {
        matchStage.bathrooms = { $gte: parseInt(filterOptions.bathrooms, 10) };
    }
    if (filterOptions.amenities) {
        // Find listings that have ALL of the specified amenities
        const amenitiesList = filterOptions.amenities.split(',').map((item) => item.trim());
        matchStage.amenities = { $all: amenitiesList };
    }
    if (filterOptions.avgRating) {
        matchStage.avgRating = { $gte: parseFloat(filterOptions.avgRating) };
    }

    // Filter by status if it's provided. If not, listings of all statuses are returned.
    if (filterOptions.status) {
        matchStage.status = filterOptions.status;
    }

    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
    }

    // Stage 4: Project the final fields to shape the output
    pipeline.push({
        $project: { hostInfo: 0, hostId: 0 }, // Exclude temporary and original host fields
    });

    const listings = await Listing.aggregatePaginate(pipeline, paginateOptions);
    return listings;
};


/**
 * Update listing by id
 * @param {mongoose.ObjectId} listingId
 * @param {Object} updateBody
 * @param {mongoose.ObjectId} userId - The user performing the action
 * @returns {Promise<Listing>}
 */
const updateListingById = async (listingId, updateBody, userId) => {
    const listing = await getListingById(listingId);

    if (listing.hostId.toString() !== userId.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this listing');
    }

    if (updateBody.title && (await Listing.isTitleTaken(updateBody.title, listingId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Listing title already taken');
    }

    Object.assign(listing, updateBody);
    await listing.save();
    return listing;
};

/**
 * Delete listing by id
 * @param {mongoose.ObjectId} listingId
 * @param {mongoose.ObjectId} userId - The user performing the action
 * @returns {Promise<void>}
 */
const deleteListingById = async (listingId, userId) => {
    const listing = await getListingById(listingId);

    if (listing.hostId.toString() !== userId.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this listing');
    }

    await listing.deleteOne();
};

module.exports = {
    createListing,
    queryListings,
    getListingById,
    updateListingById,
    deleteListingById,
};

