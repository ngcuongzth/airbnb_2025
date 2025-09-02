const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createListing = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        address: Joi.string().required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
            'array.length': 'Coordinates must be an array of [longitude, latitude]',
        }),
        pricePerNight: Joi.number().positive().required(),
        maxGuests: Joi.number().integer().min(1).required(),
        bedrooms: Joi.number().integer().min(0),
        bathrooms: Joi.number().integer().min(0),
        amenities: Joi.array().items(Joi.string()),
    }),
};

const queryListings = {
    query: Joi.object().keys({
        title: Joi.string(),
        hostName: Joi.string(),
        maxGuests: Joi.number().integer().min(1),
        price_min: Joi.number().integer().min(0),
        price_max: Joi.number().integer().min(0),
        bedrooms: Joi.number().integer().min(0),
        bathrooms: Joi.number().integer().min(0),
        amenities: Joi.string(), // Comma-separated values like "Wifi,Pool"
        status: Joi.string().valid('active', 'inactive', 'pending'),
        avgRating: Joi.number().min(0).max(5),
        near: Joi.string()
            .regex(/^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*,\s*(\d+(\.\d+)?)\s*$/)
            .message('near must be in "longitude,latitude,distance_in_km" format'),
        sortBy: Joi.string().regex(/^[a-zA-Z0-9_]+:(asc|desc)$/).message(
            'sortBy must be in "field:order" format, e.g., "pricePerNight:asc"'
        ),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const updateListing = {
    params: Joi.object().keys({
        listingId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            description: Joi.string(),
            address: Joi.string(),
            pricePerNight: Joi.number().positive(),
            maxGuests: Joi.number().integer().min(1),
            amenities: Joi.array().items(Joi.string()),
        })
        .min(1),
};


const getListing = {
    params: Joi.object().keys({
        listingId: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    createListing,
    queryListings,
    getListing,
    updateListing,
};

