const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { userController } = require('../controllers');

const router = express.Router();

router.get('/me', auth(), userController.getMe);

module.exports = router;

