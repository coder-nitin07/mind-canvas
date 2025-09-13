const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createWorkSpace } = require('../controllers/workSpaceController');
const workSpaceRouter = express.Router();

workSpaceRouter.post('/create', authMiddleware, createWorkSpace);

module.exports = { workSpaceRouter };