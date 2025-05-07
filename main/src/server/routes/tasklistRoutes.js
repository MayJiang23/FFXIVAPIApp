/* eslint-disable no-undef */
// src/server/routes/tasklistRoutes.js
const express = require('express');
const router = express.Router();

const { getAllTasks, 
    deleteTask, 
    updateTaskDesc, 
    addTask, 
    completeTask } = require('../controllers/tasklistControllers');

// GET route that fetches all items in the db
router.get('/items', getAllTasks);

// POST route that add a single task to the db
router.post('/add', addTask);

// DELETE route that delete a single task in db
router.delete('/delete', deleteTask);

// PATCH route that update complete status of task in db
router.patch('/complete', completeTask);

// PATCH route that update description of task in db
router.patch('/updatedesc', updateTaskDesc);

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
