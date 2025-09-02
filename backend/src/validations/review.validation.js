const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {

    body: Joi.object().keys({
        rating: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().allow(''),
        bookingId: Joi.string().custom(objectId).required(),
    }),
};

const getReviews = {
    params: Joi.object().keys({
        listingId: Joi.string().custom(objectId).required(),
    }),
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

module.exports = {
    createReview,
    getReviews,
};

