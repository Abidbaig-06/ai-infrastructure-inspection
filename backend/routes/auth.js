const express = require('express');
const router = express.Router();
const { login, register, getDemoOfficers } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/signup', register);
router.get('/demo-officers', getDemoOfficers);

module.exports = router;
