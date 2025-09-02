const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBooking = {
    params: Joi.object().keys({
        listingId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
        checkIn: Joi.date().iso().required(),
        checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
        guests: Joi.number().integer().min(1).required(),
    }),
};


const getBookings = {
    query: Joi.object().keys({
        role: Joi.string().valid('guest', 'host'),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getBooking = {
    params: Joi.object().keys({
        bookingId: Joi.string().custom(objectId).required(),
    }),
};

const updateBookingStatus = {
    params: Joi.object().keys({
        bookingId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
        status: Joi.string().required().valid('confirmed', 'cancelled'),
    }),
};

module.exports = {
    createBooking,
    getBookings,
    getBooking,
    updateBookingStatus,
};

