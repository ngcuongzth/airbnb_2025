const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { bookingService } = require('../services');
const pick = require('../utils/pick');

const createBooking = catchAsync(async (req, res) => {
    const bookingBody = { ...req.body, guestId: req.user.id, listingId: req.params.listingId };
    const booking = await bookingService.createBooking(bookingBody);
    res.status(httpStatus.CREATED).send({ message: 'Booking created successfully', data: booking });
});

const getBookings = catchAsync(async (req, res) => {
    // Default filter is for the current user as a guest
    const filter = { guestId: req.user.id };
    // If role=host is specified, filter for the current user as a host
    if (req.query.role === 'host') {
        filter.hostId = req.user.id;
        delete filter.guestId;
    }
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await bookingService.queryBookings(filter, options);
    res.send(result);
});

const getBooking = catchAsync(async (req, res) => {
    const booking = await bookingService.getBookingById(req.params.bookingId, req.user.id);
    res.send(booking);
});

const updateBookingStatus = catchAsync(async (req, res) => {
    const booking = await bookingService.updateBookingStatus(req.params.bookingId, req.body.status, req.user.id);
    res.send({ message: 'Booking status updated successfully', data: booking });
});

module.exports = {
    createBooking,
    getBookings,
    getBooking,
    updateBookingStatus,
}


