const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createNote, getNoteDetails, getAllNotes, updateNote } = require('../controllers/noteController');
const noteRouter = express.Router();

noteRouter.post('/:boardId/create', authMiddleware, createNote);
noteRouter.get('/:noteId', authMiddleware, getNoteDetails);
noteRouter.get('/:boardId/notes', authMiddleware, getAllNotes);
noteRouter.put('/:noteId', authMiddleware, updateNote);

module.exports = { noteRouter };