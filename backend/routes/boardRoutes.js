const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createBoard, getBoardDetails, getAllBoards, updateBoard, deleteBoard } = require('../controllers/boardController');
const boardRouter = express.Router();

boardRouter.post('/create/:workSpaceId', authMiddleware, createBoard);
boardRouter.get('/:boardId', authMiddleware, getBoardDetails);
boardRouter.get('/:workSpaceId/boards', authMiddleware, getAllBoards);
boardRouter.put('/:boardId', authMiddleware, updateBoard);
boardRouter.delete('/:boardId', authMiddleware, deleteBoard);

module.exports = { boardRouter };