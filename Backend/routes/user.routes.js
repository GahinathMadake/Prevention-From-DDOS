const express = require('express');
const router = express.Router();

const authmiddleware = require('../middleware/authmiddleware');
const {getuser, logoutUser} = require('../controllers/user.controller');

// Example Route
router.get('/get-user', authmiddleware, getuser);
router.post('/logout', authmiddleware, logoutUser);

module.exports = router; 