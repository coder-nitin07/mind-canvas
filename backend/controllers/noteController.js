const prisma = require('../config/prisma');

// create notes
const createNote = async (req, res)=>{
    try {
        const { content } = req.body;
        if(!content){
            return res.status(404).json({ message: 'Content is required' });
        }

        const boardId = req.params.boardId;
        if(!boardId){
            return res.status(404).json({ message: 'BoardId is required' });
        }

        const getBoard = await prisma.board.findUnique({
            where: { id: boardId }
        });
        if(!getBoard){
            return res.status(404).json({ message: 'Board not found' });
        }

        const isMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: getBoard.workspaceId,
                userId: req.user.userId
            }
        });
        if(!isMember || (isMember.role !== 'OWNER' && isMember.role !== 'ADMIN' && isMember.role !== 'EDITOR')){
            return res.status(403).json({ message: 'You are not authorized to Create the Notes.' });
        }

        const note = await prisma.note.create({
            data: {
                content,
                boardId: boardId,
                authorId: req.user.userId
            }
        });

        res.status(201).json({ message: 'Note Created Successfully', note });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get a note
const getNoteDetails = async (req, res)=>{
    try {
        const noteId = req.params.noteId;
        if(!noteId){
            return res.status(400).json({ message: 'NoteId is required' });
        }

        const getNote = await prisma.note.findUnique({
            where: {
                id: noteId
            }
        });
        if(!getNote){
            return res.status(404).json({ message: 'Note not found' });
        }

        const isMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: getNote.workspaceId,
                userId: req.user.userId
            }
        });
        if(!isMember){
            return res.status(403).json({ message: 'You are not a member of this workspace' });
        }

        res.status(200).json({ message: 'Note Fetched Successfully', note: getNote });
    } catch (err) {
        console.log('Server Error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get All Notes Of a Board
const getAllNotes = async (req, res)=>{
    try {
        const boardId = req.params.boardId;
        if(!boardId){
            return res.status(400).json({ message: 'BoardId is required' });
        }

        // check board exist
        const board = await prisma.board.findUnique({
            where: { id: boardId },
        });
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // check user part of the workspace
        const isMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: board.workspaceId,
                userId: req.user.userId
            }
        });
        if(!isMember){
            return res.status(403).json({ message: 'You are not authorized to view these Notes.' });
        }

         const getNotes = await prisma.note.findMany({
            where: {
                boardId
            }
        });
        
         if(getNotes.length === 0){
            return res.status(200).json({ notes: [] });
        }

        res.status(200).json({ message: 'Notes Fetched Successfully', notes: getNotes })
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update a Note
const updateNote = async (req, res)=>{
    try {
        const { content } = req.body;
        if(!content){
            return res.status(400).json({ message: 'Content is required' });
        }

        const noteId = req.params.noteId;
        if(!noteId){
            return res.status(400).json({ message: 'NoteId is required' });
        }

        // check note exist
        const getNote = await prisma.note.findUnique({
            where: {
                id: noteId
            },
            include: { board: true }
        });
        if(!getNote){
            return res.status(404).json({ message: 'Note not found' });
        }

        // check the User member of workSpace
        const isMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: getNote.board.workspaceId,
                userId: req.user.userId
            }
        });
        if(!isMember || !['OWNER', 'ADMIN', 'EDITOR'].includes(isMember.role)){
            return res.status(403).json({ message: 'You are not authorized to Update the Notes.' });
        }

        // Update note
        const updatedNote = await prisma.note.update({
            where: { id: noteId },
            data: {
                content
            }
        });

        res.status(200).json({ message: 'Note Updated Successfully', note: updatedNote })
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


// Delete a Note
const deleteNote = async (req, res)=>{
    try {
        const noteId = req.params.noteId;
        if(!noteId){
            return res.status(400).json({ message: 'NoteId is required' });
        }

        // check note exist
        const getNote = await prisma.note.findUnique({
            where: {
                id: noteId
            },
            include: { board: true }
        });
        if(!getNote){
            return res.status(404).json({ message: 'Note not found' });
        }

        // check the User member of workSpace
        const isMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: getNote.board.workspaceId,
                userId: req.user.userId
            }
        });
        if(!isMember || !['OWNER', 'ADMIN', 'EDITOR'].includes(isMember.role)){
            return res.status(404).json({ message: 'You are not authorized to Delete the Notes.' });
        }

        // delete note
        const deletedNote = await prisma.note.delete({
            where: { id: noteId }
        });

        res.status(200).json({ message: 'Note Deleted Successfully', note: deletedNote })
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createNote, getNoteDetails, getAllNotes, updateNote, deleteNote };