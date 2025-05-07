/* eslint-disable no-undef */
// src/server/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const { userLogin, userRegister } = require('../controllers/authControllers');

// POST Route to handle customer login requests
router.post('/login', userLogin); 

// POST Route to handle customer register requests
router.post('/create', userRegister);

// GET Route that renders the register page
router.get('/create', (req, res) => {
	res.render("create");
});

// GET Route that renders the login page
router.get('/login', (req, res) => {
	res.render("login");
});

let lastHeartbeat = Date.now();

// monitor availability
setInterval(() => {
    if (Date.now() - lastHeartbeat > 10000) {
        console.warn("Server may be unresponsive!");
    }
}, 15 * 1000);


// health ping endpoint
router.get('/health', (req, res) => {
    lastHeartbeat = Date.now();
    res.send({ status: 'OK' });
});


module.exports = router;

