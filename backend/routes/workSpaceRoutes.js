const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createWorkSpace, getWorkSpace } = require('../controllers/workSpaceController');
const workSpaceRouter = express.Router();

workSpaceRouter.post('/create', authMiddleware, createWorkSpace);
workSpaceRouter.get('/getWorkSpace/:id', authMiddleware, getWorkSpace);

module.exports = { workSpaceRouter };