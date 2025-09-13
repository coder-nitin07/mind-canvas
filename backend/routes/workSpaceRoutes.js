const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createWorkSpace, getWorkSpace, getUserWorkSpace, updateWorkSpace } = require('../controllers/workSpaceController');
const workSpaceRouter = express.Router();

workSpaceRouter.post('/create', authMiddleware, createWorkSpace);
workSpaceRouter.get('/getWorkSpace/:id', authMiddleware, getWorkSpace);
workSpaceRouter.get('/getUserWorkSpace', authMiddleware, getUserWorkSpace);
workSpaceRouter.put('/update/:id', authMiddleware, updateWorkSpace);

module.exports = { workSpaceRouter };