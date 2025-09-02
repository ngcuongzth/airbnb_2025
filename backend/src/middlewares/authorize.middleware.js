const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const authorize = (...requiredRoles) => (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    const { role } = req.user;

    if (!requiredRoles.includes(role) && role !== 'admin') {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden: You do not have the required role to perform this action'));
    }

    next();
};

module.exports = authorize;

