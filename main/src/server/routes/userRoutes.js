/* eslint-disable no-undef */
// src/server/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const { getUserName } = require('../controllers/userControllers');

router.get('/name', getUserName);

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
