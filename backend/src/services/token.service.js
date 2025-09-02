const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');

/**
 * Generate token
 * @param {mongoose.ObjectId} userId
 * @param {moment.Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, 'access');

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
    };
};

module.exports = {
    generateToken,
    generateAuthTokens,
};

