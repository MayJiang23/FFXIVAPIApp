/* eslint-disable no-undef */
// src/server/routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes.js');
const apiRoutes = require('./apiRoutes.js');
const tasklistRoutes = require('./tasklistRoutes.js');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');

// Attach different route files
router.use('/auth', authRoutes);        // Routes for authentication (e.g., /auth/login)
router.use('/user', authMiddleware, userRoutes);
router.use('/api', authMiddleware, apiRoutes);
router.use('/tasklist', authMiddleware, tasklistRoutes);
router.get('/', authMiddleware, (req, res) => {
    res.render("main");
});


module.exports = router;
