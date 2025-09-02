const httpStatus = require('http-status');
const { Booking, Listing } = require('../models');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

/**
 * Create a booking
 * @param {Object} bookingBody
 * @returns {Promise<Booking>}
 */
const createBooking = async (bookingBody) => {
    const { listingId, guestId, checkIn, checkOut, guests } = bookingBody;

    const listing = await Listing.findById(listingId);
    if (!listing) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Listing not found');
    }


    if (listing.hostId.equals(guestId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot book your own listing');
    }

    if (guests > listing.maxGuests) {
        throw new ApiError(httpStatus.BAD_REQUEST, `This listing only accommodates up to ${listing.maxGuests} guests`);
    }

    // Check for date availability
    const existingBooking = await Booking.findOne({
        listingId,
        status: { $in: ['pending', 'confirmed'] },
        // Check for any overlap in dates
        // An overlap exists if (StartA < EndB) and (EndA > StartB)
        $or: [
            { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
        ],
    });

    if (existingBooking) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'The selected dates are not available');
    }

    // Use moment.js to accurately calculate the number of nights, ignoring time of day.
    // This correctly reflects the business logic of charging per night.
    const checkInDate = moment(checkIn).startOf('day');
    const checkOutDate = moment(checkOut).startOf('day');
    const nights = checkOutDate.diff(checkInDate, 'days');
    const totalAmount = nights * listing.pricePerNight;

    let newBooking = await Booking.create({ ...bookingBody, hostId: listing.hostId, totalAmount });
    // Populate the booking with details for a richer response
    newBooking = await newBooking.populate([
        { path: 'listingId', select: 'title address pricePerNight' },
        { path: 'guestId', select: 'name email' },
        { path: 'hostId', select: 'name email' },
    ]);

    return newBooking;
};

/**
 * Query for bookings
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryBookings = async (filter, options) => {
    const paginateOptions = {
        ...options,
        populate: [
            { path: 'listingId', select: 'title address pricePerNight' },
            { path: 'guestId', select: 'name' },
        ],
    };
    const bookings = await Booking.paginate(filter, paginateOptions);
    return bookings;
};

/**
 * Get booking by id
 * @param {mongoose.ObjectId} id
 * @param {mongoose.ObjectId} userId
 * @returns {Promise<Booking>}
 */
const getBookingById = async (id, userId) => {
    const booking = await Booking.findById(id).populate('listingId', 'title address').populate('guestId', 'name').populate('hostId', 'name');
    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    // Ensure the user is either the guest or the host
    if (!booking.guestId.equals(userId) && !booking.hostId.equals(userId)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to view this booking');
    }
    return booking;
};

/**
 * Update booking status by id
 * @param {mongoose.ObjectId} bookingId
 * @param {string} status
 * @param {mongoose.ObjectId} userId
 * @returns {Promise<Booking>}
 */
const updateBookingStatus = async (bookingId, status, userId) => {
    const booking = await getBookingById(bookingId, userId);

    // Ensure only the host can confirm or cancel
    if (!booking.hostId.equals(userId)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the host can update the booking status');
    }

    booking.status = status;
    await booking.save();
    return booking;
};


module.exports = {
    createBooking,
    queryBookings,
    getBookingById,
    updateBookingStatus,
};

