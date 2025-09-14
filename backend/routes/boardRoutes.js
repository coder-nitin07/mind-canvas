const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createBoard, getBoardDetails } = require('../controllers/boardController');
const boardRouter = express.Router();

boardRouter.post('/create/:workSpaceId', authMiddleware, createBoard);

module.exports = { boardRouter };