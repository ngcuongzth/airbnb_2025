const express = require('express');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const { bookingValidation } = require('../validations');
const { bookingController } = require('../controllers');


const nestedRouter = express.Router({ mergeParams: true });
const topLevelRouter = express.Router();

nestedRouter.route('/').post(auth(), authorize('guest'), validate(bookingValidation.createBooking), bookingController.createBooking);

topLevelRouter
    .route('/')
    .get(auth(), validate(bookingValidation.getBookings), bookingController.getBookings);

topLevelRouter
    .route('/:bookingId')
    .get(auth(), validate(bookingValidation.getBooking), bookingController.getBooking);

topLevelRouter
    .route('/:bookingId/status')
    .patch(auth(), authorize('host'), validate(bookingValidation.updateBookingStatus), bookingController.updateBookingStatus);

module.exports = { nestedRouter, topLevelRouter };

