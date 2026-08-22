const express = require('express');
const router = express.Router();
const { login, getDemoOfficers } = require('../controllers/authController');

router.post('/login', login);
router.get('/demo-officers', getDemoOfficers);

module.exports = router;
