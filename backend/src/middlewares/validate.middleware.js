// Middleware for validating request data
const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);

    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.path.slice(1).join('.'),
            message: detail.message.replace(/['"]/g, ''),
        }));
        return next(new ApiError(httpStatus.BAD_REQUEST, 'Validation Error', errors));
    }
    Object.assign(req, value);
    return next();
};

module.exports = validate;

