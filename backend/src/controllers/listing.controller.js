const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { listingService } = require('../services');
const pick = require('../utils/pick');

const createListing = catchAsync(async (req, res) => {
    // Add hostId from the authenticated user (provided by the auth middleware)
    const listingBody = { ...req.body, hostId: req.user.id };
    const listing = await listingService.createListing(listingBody);
    res.status(httpStatus.CREATED).send(listing);
});

const getListings = catchAsync(async (req, res) => {
    const filter = pick(req.query, [
        'title',
        'maxGuests',
        'hostName',
        'price_min',
        'price_max',
        'near',
        'bedrooms',
        'bathrooms',
        'amenities',
        'status',
        'avgRating',
    ]);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await listingService.queryListings(filter, options);
    res.send(result);
});

const getListing = catchAsync(async (req, res) => {
    const listing = await listingService.getListingById(req.params.listingId);
    res.send(listing);
});

const updateListing = catchAsync(async (req, res) => {
    const listing = await listingService.updateListingById(req.params.listingId, req.body, req.user.id);
    res.send(listing);
});

const deleteListing = catchAsync(async (req, res) => {
    await listingService.deleteListingById(req.params.listingId, req.user.id);
    res.status(httpStatus.OK).send({ message: 'Listing deleted successfully' });
});

module.exports = {
    createListing,
    getListings,
    getListing,
    updateListing,
    deleteListing,
};

