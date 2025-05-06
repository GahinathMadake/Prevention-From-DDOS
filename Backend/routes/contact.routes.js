const express = require('express');
const {submitContactForm} = require('../controllers/contact.controller');
const authmiddleware = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/', authmiddleware, submitContactForm);

module.exports = router;
