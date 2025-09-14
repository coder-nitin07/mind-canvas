const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createNote, getNoteDetails } = require('../controllers/noteController');
const noteRouter = express.Router();

noteRouter.post('/:boardId/create', authMiddleware, createNote);
noteRouter.get('/:noteId', authMiddleware, getNoteDetails);

module.exports = { noteRouter };