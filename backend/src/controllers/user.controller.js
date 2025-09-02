const catchAsync = require('../utils/catchAsync');

const getMe = catchAsync(async (req, res) => {
    // req.user is attached by the auth middleware
    res.send(req.user);
});

module.exports = {
    getMe,
};

