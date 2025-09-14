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

module.exports = { createNote, getNoteDetails };