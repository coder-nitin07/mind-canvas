const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createNote, getNoteDetails, getAllNotes, updateNote, deleteNote, updateNotePosition } = require('../controllers/noteController');
const noteRouter = express.Router();

noteRouter.post('/:boardId/create', authMiddleware, createNote);
noteRouter.get('/:noteId', authMiddleware, getNoteDetails);
noteRouter.get('/:boardId/notes', authMiddleware, getAllNotes);
noteRouter.put('/:noteId', authMiddleware, updateNote);
noteRouter.patch('/:noteId/position', authMiddleware, updateNotePosition);
noteRouter.delete('/:noteId', authMiddleware, deleteNote);

module.exports = { noteRouter };