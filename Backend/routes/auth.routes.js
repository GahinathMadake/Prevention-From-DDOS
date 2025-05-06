const express = require('express');
const router = express.Router();

const { sendOTP, verifyOTP, loginUser } =  require('../controllers/auth.controller');

// Send OTP route
router.post('/send-otp', sendOTP);

// Verify OTP route
router.post('/verify-otp', verifyOTP);

// login user
router.post('/login', loginUser);



module.exports = router;