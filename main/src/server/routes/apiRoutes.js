/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { listAllMapRowID, getMap, getMapRow } = require('../controllers/apiControllers');

router.get('/locations', (req, res) => {
	res.render('locations');
});

router.get('/map', listAllMapRowID);

router.get('/map/image/:territory/:index', getMap);

router.get('/map/row/:row', getMapRow);

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
